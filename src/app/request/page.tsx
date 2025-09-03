"use client";

import React from "react";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PageLayout from "@/components/Layout/PageLayout";

export default function RequestPage() {
  return (
    <PageLayout
      title="Request"
      icon={<AssignmentOutlinedIcon />}
      showLogout={true}
    >
      <p>Request management coming soon…</p>
      <p>This page will contain request handling and tracking features.</p>
    </PageLayout>
  );
}
