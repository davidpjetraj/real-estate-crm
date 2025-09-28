import { apolloClient } from "@/lib/graphql/ApolloWrapper";
import {
  AccountDocument,
  AccountQuery,
  LoginDocument,
  LoginMutation,
  VerifyLoginDocument,
  VerifyLoginMutation,
  AppConfigsDocument,
  AppConfigsQuery,
  AppConfigVersionUpdatedDocument,
  AppConfigVersionUpdatedSubscription,
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

export interface ConfigData {
  users: any[];
  states: any[];
  cities: any[];
  streets: any[];
  version: number;
}

interface StoreState {
  user: any;
  loading: boolean;
  error?: string;
  isAuthenticated?: boolean;
  config_data: ConfigData;
  config_version: number;
  config_loading: boolean;
  config_error?: string;
  config_subscription?: any;

  // Auth actions
  getAccount: (payload: { onCompleted?: () => void }) => Promise<void>;
  login: (values: LoginInput) => Promise<void>;
  verify: (values: VerifyInput) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (payload: any) => void;
  setState: (payload: any) => void;

  // Config actions
  loadConfig: () => Promise<void>;
  startConfigSubscription: () => void;
  stopConfigSubscription: () => void;
  initData: () => Promise<void>;
  setBackgroundInitData: () => Promise<void>;
}

const initialConfigData: ConfigData = {
  users: [],
  states: [],
  cities: [],
  streets: [],
  version: 1,
};

const useAuth = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      error: "",
      isAuthenticated: false,
      config_data: initialConfigData,
      config_version: 1,
      config_loading: false,
      config_error: undefined,
      config_subscription: null,
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
            values.startVerify(res.data?.login);
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

          set({
            loading: false,
            isAuthenticated: true,
            user: { email: values.token }, // Set basic user data
          });

          await get().getAccount({});
          values.startVerify("/dashboard");
        } catch (error: any) {
          console.log(error);
          set({
            loading: false,
            user: null,
            error: error?.message || "Verification failed",
          });
        }
      },
      setState: (payload) => {
        set({ ...get(), ...payload });
      },

      logout: async () => {
        try {
          set({ loading: true });

          // Stop config subscription
          get().stopConfigSubscription();

          await setTokens({
            access_token: "",
            refresh_token: "",
          });
          await apolloClient.clearStore();

          set({
            user: null,
            loading: false,
            isAuthenticated: false,
            config_data: initialConfigData,
            config_version: 1,
            config_loading: false,
            config_error: undefined,
            config_subscription: null,
          });
        } catch (error: any) {
          console.log(error.message);
          set({ loading: false });
        }
      },
      setUser: (payload) => {
        set({ user: { ...get().user, ...payload } });
      },

      // Config methods
      loadConfig: async () => {
        try {
          set({ config_loading: true, config_error: undefined });

          const res = await apolloClient.query<AppConfigsQuery>({
            query: AppConfigsDocument,
            fetchPolicy: "network-only", // Always fetch fresh config data
          });

          if (res.data?.appConfigs) {
            const configData: ConfigData = {
              users: res.data.appConfigs.users || [],
              states: res.data.appConfigs.states || [],
              cities: res.data.appConfigs.cities || [],
              streets: res.data.appConfigs.streets || [],
              version: res.data.appConfigs.version || 1,
            };

            set({
              config_data: configData,
              config_version: configData.version,
              config_loading: false,
            });
          }
        } catch (error: any) {
          console.error("Failed to load config:", error);
          set({
            config_loading: false,
            config_error: error?.message || "Failed to load configuration",
          });
        }
      },

      startConfigSubscription: () => {
        try {
          const { config_subscription } = get();

          // Don't start if already subscribed
          if (config_subscription) {
            return;
          }

          const sub = apolloClient
            .subscribe<AppConfigVersionUpdatedSubscription>({
              query: AppConfigVersionUpdatedDocument,
            })
            .subscribe({
              next: (result) => {
                const newVersion =
                  result.data?.appConfigVersionUpdated?.version;
                const currentVersion = get().config_version;

                if (newVersion && newVersion !== currentVersion) {
                  get().loadConfig();
                }
              },
              error: (error) => {
                console.error("Config subscription error:", error);
                set({ config_subscription: null });
              },
            });

          set({ config_subscription: sub });
        } catch (error) {
          console.error("Failed to start config subscription:", error);
        }
      },

      stopConfigSubscription: () => {
        const { config_subscription } = get();
        if (config_subscription) {
          config_subscription.unsubscribe();
          set({ config_subscription: null });
        }
      },

      initData: async () => {
        try {
          // Load config data
          await get().loadConfig();

          // Start config subscription
          get().startConfigSubscription();
        } catch (error) {
          console.error("Failed to initialize app data:", error);
        }
      },
      setBackgroundInitData: async () => {
        try {
          // Load config data in background
          await get().loadConfig();

          // Ensure config subscription is running
          if (!get().config_subscription) {
            get().startConfigSubscription();
          }
        } catch (error) {
          console.error("Failed to background initialize app data:", error);
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        config_data: state.config_data,
        config_version: state.config_version,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuth;
