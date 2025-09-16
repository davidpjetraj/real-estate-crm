import { apolloClient } from "@/lib/graphql/ApolloWrapper";
import {
  AccountDocument,
  AccountModel,
  AccountQuery,
  LoginDocument,
  LoginMutation,
  VerifyLoginDocument,
  VerifyLoginMutation,
} from "@/lib/graphql/generated/graphql";
import { setTokens } from "@/lib/graphql/utils";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type LoginInput = {
  email: string;
  password: string;
  startVerify: (token: string) => Promise<void>;
};

type VerifyInput = {
  token: string;
  code: string;
  startVerify: (token: string) => Promise<void>;
};

interface StoreState {
  user: any;
  loading: boolean;
  error?: string;
  isAuthenticated?: boolean;
  getAccount: (payload: { onCompleted?: () => void }) => Promise<void>;
  login: (values: LoginInput) => Promise<void>;
  verify: (values: VerifyInput) => Promise<void>;
  setState: (payload: any) => void;
  logout: () => Promise<void>;
  setUser: (payload: Partial<AccountModel>) => void;
  initData: () => Promise<void>;
  setBackgroundInitData: () => Promise<void>;
}

const useAuth = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      error: "",
      isAuthenticated: false,
      config_data: {
        categories: [],
        cities: [],
        version: 1,
      },
      config_version: 1,
      getAccount: async ({ onCompleted }: { onCompleted?: () => void }) => {
        try {
          const res = await apolloClient.query<AccountQuery>({
            query: AccountDocument,
          });

          set({ user: res?.data?.account, loading: false });
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          onCompleted && onCompleted();
        } catch (error) {
          set({ loading: false });
          console.log(error);
        }
      },
      login: async (values) => {
        try {
          const res = await apolloClient.mutate<LoginMutation>({
            mutation: LoginDocument,
            variables: {
              input: {
                email: values.email,
                password: values.password,
              },
            },
          });
          if (res.data?.login) {
            // Automatically call verifyLogin with the token and a dummy code
            try {
              const verifyRes = await apolloClient.mutate<VerifyLoginMutation>({
                mutation: VerifyLoginDocument,
                variables: {
                  input: {
                    token: res.data.login,
                  },
                },
              });

              if (verifyRes.data?.verifyLogin) {
                console.log("Verify login successful, storing tokens");
                console.log(
                  "Access token:",
                  verifyRes.data.verifyLogin.access_token
                );
                console.log(
                  "Refresh token:",
                  verifyRes.data.verifyLogin.refresh_token
                );
                // Store the real access and refresh tokens
                await setTokens({
                  access_token: verifyRes.data.verifyLogin.access_token,
                  refresh_token: verifyRes.data.verifyLogin.refresh_token,
                });
                console.log("Tokens stored successfully");

                // Set authenticated state
                set({
                  loading: false,
                  isAuthenticated: true,
                  user: { email: values.email }, // Set basic user data
                });

                // Try to fetch full user account data
                try {
                  await get().getAccount({});
                  console.log("User account data fetched successfully");
                } catch (accountError) {
                  console.log(
                    "Account fetch failed, but login succeeded:",
                    accountError
                  );
                  // Keep the basic user data we set above
                }

                console.log("Login successful, redirecting to dashboard");
                values.startVerify("/dashboard");
              }
            } catch (verifyError: any) {
              console.log("Verify login failed:", verifyError);
              set({
                loading: false,
                user: null,
                error: verifyError?.message || "Verification failed",
              });
            }
          }
        } catch (error: any) {
          set({
            loading: false,
            user: null,
            error: error?.message,
          });
        }
      },
      verify: async (values) => {
        try {
          const res = await apolloClient.mutate<VerifyLoginMutation>({
            mutation: VerifyLoginDocument,
            variables: {
              input: {
                token: values.token,
                verify_code: values.code,
              },
            },
          });
          await setTokens({
            access_token: res.data?.verifyLogin.access_token as string,
            refresh_token: res.data?.verifyLogin.refresh_token as string,
          });
          await get().getAccount({});
          values.startVerify("/");
        } catch (error: any) {
          console.log(error);
        }
      },
      setState: (payload) => {
        set({ ...get(), ...payload });
      },
      logout: async () => {
        try {
          set({
            loading: true,
          });
          await apolloClient.mutate<LoginMutation>({
            mutation: LoginDocument,
          });
          await setTokens({
            access_token: "",
            refresh_token: "",
          });
          await apolloClient.clearStore();
          set({
            user: null,
            loading: false,
          });
        } catch (error: any) {
          console.log(error.message);
          set({
            loading: false,
          });
        }
      },
      setUser: (payload) => {
        set({ user: { ...get().user, ...payload } });
      },
      initData: async () => {},
      setBackgroundInitData: async () => {},
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);

export default useAuth;
