"use client";

import React, { useEffect, useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import { Table } from "@/components/Table";
import { Button } from "@mui/material";
import { PlusIcon } from "@/components/icons/PlusIcon";
// import { useRouter } from "next/navigation";
import { useTeam } from "../../../store/useTeam";
import { CreateTeamMemberDialog } from "@/components/Dialog";

export default function TeamPage() {
  // const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const getData = useTeam((state) => state.getData);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleAddTeam = () => {
    setIsCreateDialogOpen(true);
  };

  // const handleEditTeam = (team: any) => {
  //   router.push(`/team/edit/${team.id}`);
  // };

  // const handleDeleteTeam = (team: any) => {
  //   if (window.confirm(`Are you sure you want to delete ${team.name}?`)) {
  //     teamStore.getState().removeItem(team.id);
  //   }
  // };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const columns = useTeam((state) => state.columns);
  const addItem = useTeam((state) => state.addItem);

  return (
    <PageLayout title="Team" showProfile={true}>
      <Table
        columns={columns}
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
    </PageLayout>
  );
}
