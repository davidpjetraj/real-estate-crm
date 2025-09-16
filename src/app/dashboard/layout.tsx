"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTokens } from "@/lib/graphql/utils";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { access_token } = await getTokens();
      if (!access_token) {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  return <>{children}</>;
}
