"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import UserProfileSettings from "@/components/UserProfile/UserProfileSettings";

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { getTokens } = await import("@/lib/graphql/utils");
      const { access_token } = await getTokens();
      if (!access_token) {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div style={{ padding: "20px" }}>
      <UserProfileSettings />
    </div>
  );
}
