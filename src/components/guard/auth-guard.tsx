/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useTransition } from "react";
import { useShallow } from "zustand/shallow";

import useAuth from "../../../store/useAuth";
import { SplashScreen } from "../Loader/splash-screen";

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const { user, getAccount, loading } = useAuth(useShallow((state) => state));

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const showSplashScreen = useMemo(() => {
    return isPending || !user || loading;
  }, [isPending, loading, user]);

  useEffect(() => {
    getAccount({ onCompleted: () => {} });
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      startTransition(() => {
        router.replace(
          `/login?returnUrl=${encodeURIComponent(window.location.href)}`
        );
      });
    }
  }, [loading, user]);

  if (showSplashScreen) return <SplashScreen />;

  return <>{children}</>;
}
