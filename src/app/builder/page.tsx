"use client";

import React from "react";
import DomainAddOutlinedIcon from "@mui/icons-material/DomainAddOutlined";
import PageLayout from "@/components/Layout/PageLayout";

export default function BuilderComplexPage() {
  return (
    <PageLayout
      title="Builder"
      icon={<DomainAddOutlinedIcon />}
      showProfile={true}
    >
      <p>Builder management coming soon…</p>
      <p>
        This page will contain builder and construction company management
        features.
      </p>
    </PageLayout>
  );
}
