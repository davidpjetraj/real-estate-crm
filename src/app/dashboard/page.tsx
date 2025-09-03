import React from "react";
import PageLayout from "@/components/Layout/PageLayout";
import KanbanDashboard from "@/components/Dashboard/KanbanDashboard";
import { Metadata } from "next";
import DashboardInfo from "@/components/Dashboard/Info";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Dashboard() {
  return (
    <PageLayout title="Dashboard" showDate={false} showProfile={true}>
      <DashboardInfo />
      <KanbanDashboard />
    </PageLayout>
  );
}
