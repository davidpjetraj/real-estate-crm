/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useShallow } from "zustand/shallow";
import useAuth from "../../../store/useAuth";
import { SplashScreen } from "../Loader/splash-screen";

export default function GuestGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, getAccount } = useAuth(useShallow((state) => state));
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || `/dashboard`;

  const [isPending, startTransition] = useTransition();

  const getAccountWithTransition = () => {
    startTransition(async () => {
      await getAccount({
        onCompleted: () => {
          router.replace(decodeURIComponent(returnUrl));
        },
      });
    });
  };

  useEffect(() => {
    getAccountWithTransition();
  }, []);

  if (user || loading || isPending) {
    return <SplashScreen />;
  }
  return <>{children}</>;
}
