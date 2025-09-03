"use client";

import React from "react";
import PageLayout from "@/components/Layout/PageLayout";
// import { Table } from "@/components/Table";
// import { Button } from "@mui/material";
// import { PlusIcon } from "@/components/icons/PlusIcon";
// import { useRouter } from "next/navigation";
// import { teamColumns } from "../../../store/useTeam";

export default function TeamPage() {
  // const router = useRouter();
  return (
    <PageLayout title="Team" showProfile={true}>
      <div>Team</div>
      {/* <Table
        columns={teamColumns}
        rightActions={
          <Button
            variant="contained"
            size="medium"
            startIcon={<PlusIcon width={16} height={16} />}
            onClick={() => router.push("/team/create")}
          >
            Erstellen
          </Button>
        }
      /> */}
    </PageLayout>
  );
}
