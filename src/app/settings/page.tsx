"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import UserProfileSettings from "../../components/UserProfile/UserProfileSettings";

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div style={{ padding: "20px" }}>
      <UserProfileSettings />
    </div>
  );
}
