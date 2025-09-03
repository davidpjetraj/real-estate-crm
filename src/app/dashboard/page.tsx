import React from "react";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PageLayout from "@/components/Layout/PageLayout";
import DashboardInfo from "@/components/Dashboard/Info";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Dashboard() {
  return (
    <PageLayout
      title="Dashboard"
      icon={<DashboardOutlinedIcon />}
      showDate={false}
      showProfile={true}
    >
      <DashboardInfo />
    </PageLayout>
  );
}
