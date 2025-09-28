"use client";

import React from "react";
import {
  ApolloClient,
  ApolloProvider,
  FetchResult,
  InMemoryCache,
  Observable,
  createHttpLink,
  from,
  split,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { getTokens, removeTokens, setTokens } from "./utils";
import {
  RefreshTokenDocument,
  RefreshTokenMutation,
} from "./generated/graphql";
import useAuth from "../../../store/useAuth";
import { SplashScreen } from "@/components/Loader/splash-screen";

let isRefreshTokenRequestPending = false;
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GQL,
});

let _retry_socket = 0;
const socketClient = createClient({
  url: process.env.NEXT_PUBLIC_SUB as string,
  connectionParams: async () => {
    const { access_token } = await getTokens();
    return {
      token: access_token,
    };
  },
  keepAlive: 5_000,
  retryAttempts: Infinity,
  retryWait: async function waitForServerHealthyBeforeRetry() {
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 3000)
    );
  },
  shouldRetry: () => {
    if (_retry_socket > 10) {
      return false;
    }
    _retry_socket++;
    return true;
  },
  on: {
    connected: () => {
      console.info("socket connected");
      _retry_socket = 0;
    },
    error: (error) => {
      console.error("socket error", error);
    },
    closed: () => {
      console.warn("socket closed");
      _retry_socket = 0;
    },
  },
});

const wsLink = new GraphQLWsLink(socketClient);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const authLink = setContext(async (operation, { headers }) => {
  const locale = document.cookie
    .split("; ")
    .find((row) => row.startsWith("NEXT_LOCALE="));
  const localeValue = locale ? locale.split("=")[1] : "";

  const { access_token } = await getTokens();

  return {
    headers: {
      ...headers,
      Authorization: access_token ? `Bearer ${access_token}` : "",
      "x-lang": localeValue,
    },
  };
});

let _retry = false;
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        switch (err?.extensions?.code) {
          case "UNAUTHENTICATED":
            // ignore 401 error for a refresh request
            if (operation.operationName === "refreshToken") return;

            // Skip refresh token logic for now to prevent auto-logout
            return;

            const observable = new Observable<FetchResult<Record<string, any>>>(
              (observer) => {
                (async () => {
                  try {
                    const { refresh_token: refreshTokenFromCookie } =
                      await getTokens();
                    if (!refreshTokenFromCookie) {
                      observer.error(new Error("No refresh token available"));
                      return;
                    }

                    if (_retry) {
                      observer.error(err);
                      _retry = false;
                    } else {
                      _retry = true;

                      await refreshToken();

                      const subscriber = {
                        next: observer.next.bind(observer),
                        error: async (error: any) => {
                          observer.error(error);
                        },
                        complete: observer.complete.bind(observer),
                      };

                      forward(operation).subscribe(subscriber);
                    }
                  } catch (err) {
                    observer.error(err);
                  }
                })();
              }
            );

            return observable;
        }
      }
    }

    if (networkError) console.error(`[Network error]: ${networkError}`);
  }
);

export const link = from([errorLink, authLink, splitLink]);

export const apolloClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});

// Request a refresh token to then stores and returns the access_token.
const refreshToken = async () => {
  if (isRefreshTokenRequestPending) {
    console.error("refresh token request already running");
    await new Promise((resolve) => setTimeout(resolve, 2000)); // await 2 second
    return;
  }
  try {
    console.error("requesting new refresh token");
    isRefreshTokenRequestPending = true;

    const { refresh_token } = await getTokens();

    if (!refresh_token) {
      return;
    }

    const { data } = await apolloClient.mutate<RefreshTokenMutation>({
      mutation: RefreshTokenDocument,
      variables: {
        input: {
          refresh_token: refresh_token || "",
        },
      },
    });

    await setTokens({
      access_token: data?.refreshToken?.access_token || "",
      refresh_token: data?.refreshToken?.refresh_token || "",
    });

    console.info("new refresh token received");

    return data?.refreshToken.access_token;
  } catch (err) {
    await removeTokens();
    const { setState } = useAuth.getState();
    setState({
      user: null,
      loading: false,
    });
    throw err;
  } finally {
    isRefreshTokenRequestPending = false;
  }
};

// Auth initialization component
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { getAccount, user } = useAuth();
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have tokens but no user data
        const { access_token } = await getTokens();
        if (access_token && (!user || !user.first_name)) {
          await getAccount({});
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [getAccount, user]);

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div>
        <SplashScreen />
      </div>
    );
  }

  return <>{children}</>;
}

export default function ApolloWrapper({ children }: any) {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthInitializer>{children}</AuthInitializer>
    </ApolloProvider>
  );
}
