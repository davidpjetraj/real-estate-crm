import React from "react";
import PageLayout from "@/components/Layout/PageLayout";
// import KanbanDashboard from "@/components/Dashboard/KanbanDashboard";
import { Metadata } from "next";
import DashboardInfo from "@/components/Dashboard/Info";
import RegisteredCompanies from "@/components/Widgets/RegisteredCompanies";
import PublishedJobsWidget from "@/components/Widgets/PublishedJobsWidget";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Dashboard() {
  return (
    <PageLayout title="Dashboard" showDate={false} showProfile={true}>
      <DashboardInfo />
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ width: "50%" }}>
          <RegisteredCompanies />
        </div>
        <div style={{ width: "50%" }}>
          <PublishedJobsWidget />
        </div>
      </div>
      {/* <KanbanDashboard /> */}
    </PageLayout>
  );
}
