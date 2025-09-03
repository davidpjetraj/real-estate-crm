"use client";

import React from "react";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import PageLayout from "@/components/Layout/PageLayout";

export default function TeamPage() {
  return (
    <PageLayout title="Team" icon={<GroupOutlinedIcon />} showProfile={true}>
      <p>Team management coming soon…</p>
      <p>This page will contain team member management features.</p>
    </PageLayout>
  );
}
