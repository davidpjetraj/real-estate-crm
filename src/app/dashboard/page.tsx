"use client";

import React from "react";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PageLayout from "@/components/Layout/PageLayout";

export default function Dashboard() {
  return (
    <PageLayout
      title="Dashboard"
      icon={<DashboardOutlinedIcon />}
      showDate={true}
      showLogout={true}
    >
      <p>Welcome to the dashboard!</p>
      <p>This is a protected route.</p>
      <p>You should be able to see this only if you are logged in.</p>
    </PageLayout>
  );
}
