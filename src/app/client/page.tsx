"use client";

import React from "react";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PageLayout from "@/components/Layout/PageLayout";

export default function ClientPage() {
  return (
    <PageLayout
      title="Client"
      icon={<PeopleAltOutlinedIcon />}
      showLogout={true}
    >
      <p>Client management coming soon…</p>
      <p>This page will contain client relationship and management features.</p>
    </PageLayout>
  );
}
