"use client";

import React, { useEffect, useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import { Table } from "@/components/Table";
import { Button } from "@mui/material";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { useTeam, teamColumns } from "../../../store/useTeam";
import { CreateTeamMemberDialog } from "@/components/Dialog";
import TeamDetailsComponent from "@/components/Team/TeamDetailsComponent";

export default function TeamPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const getData = useTeam((state) => state.getData);
  const addItem = useTeam((state) => state.addItem);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleAddTeam = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  return (
    <PageLayout title="Team" showProfile={true}>
      <Table
        columns={teamColumns}
        store={useTeam}
        rightActions={
          <Button
            variant="contained"
            size="medium"
            startIcon={<PlusIcon width={16} height={16} />}
            onClick={handleAddTeam}
          >
            Add Team Member
          </Button>
        }
      />

      <CreateTeamMemberDialog
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        onSuccess={addItem}
      />

      {/* Paloka-style Team Details */}
      <TeamDetailsComponent />
    </PageLayout>
  );
}
