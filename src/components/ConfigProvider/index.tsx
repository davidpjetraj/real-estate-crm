"use client";

import { useEffect } from "react";
import useAuth from "../../../store/useAuth";

interface ConfigProviderProps {
  children: React.ReactNode;
}

/**
 * ConfigProvider component that initializes the config system
 * This should be placed high in the component tree, typically in the main layout
 * All config logic is now in useAuth like paloka_crm
 */
export function ConfigProvider({ children }: ConfigProviderProps) {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const initData = useAuth((state) => state.initData);
  const setBackgroundInitData = useAuth((state) => state.setBackgroundInitData);
  const stopConfigSubscription = useAuth(
    (state) => state.stopConfigSubscription
  );

  useEffect(() => {
    if (isAuthenticated) {
      // Initialize config data when user is authenticated
      initData();
    }
  }, [isAuthenticated, initData]);

  useEffect(() => {
    // Set up periodic background refresh of config data
    const interval = setInterval(() => {
      if (isAuthenticated) {
        setBackgroundInitData();
      }
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, setBackgroundInitData]);

  // Clean up subscription on unmount
  useEffect(() => {
    return () => {
      stopConfigSubscription();
    };
  }, [stopConfigSubscription]);

  return <>{children}</>;
}

export default ConfigProvider;
