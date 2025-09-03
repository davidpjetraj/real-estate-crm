"use client";

import React from "react";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import PageLayout from "@/components/Layout/PageLayout";

export default function PropertyPage() {
  return (
    <PageLayout
      title="Property"
      icon={<ApartmentOutlinedIcon />}
      showLogout={true}
    >
      <p>Property management coming soon…</p>
      <p>This page will contain property listing and management features.</p>
    </PageLayout>
  );
}
