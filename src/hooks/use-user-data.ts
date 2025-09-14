import { useState, useEffect } from "react";
import { userStore, UserData } from "../lib/user-store";

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial data
    const data = userStore.getUserData();
    setUserData(data);
    setLoading(false);

    // Subscribe to changes
    const unsubscribe = userStore.subscribe(() => {
      const updatedData = userStore.getUserData();
      setUserData(updatedData);
    });

    return unsubscribe;
  }, []);

  const updateUserData = (updates: Partial<UserData>) => {
    userStore.updateUserData(updates);
  };

  const clearUserData = () => {
    userStore.clearUserData();
  };

  return {
    userData,
    loading,
    updateUserData,
    clearUserData,
  };
}
