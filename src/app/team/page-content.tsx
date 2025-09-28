"use client";

import React, { useEffect, useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import { Table } from "@/components/Table";
import { Button } from "@mui/material";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { useTeam, teamColumns } from "../../../store/useTeam";
import { CreateTeamMemberDialog } from "@/components/Dialog";
import { TeamDetailsModal } from "@/components/Team";

export default function TeamPage() {
  // const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const getData = useTeam((state) => state.getData);
  const addItem = useTeam((state) => state.addItem);
  const detailsModalOpen = useTeam((state) => state.detailsModalOpen);
  const selectedTeamMemberId = useTeam((state) => state.selectedTeamMemberId);
  const openDetailsModal = useTeam((state) => state.openDetailsModal);
  const closeDetailsModal = useTeam((state) => state.closeDetailsModal);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    const handleOpenTeamDetails = (event: CustomEvent) => {
      const { id } = event.detail;
      if (id) {
        openDetailsModal(id);
      }
    };

    window.addEventListener(
      "openTeamDetails",
      handleOpenTeamDetails as EventListener
    );

    return () => {
      window.removeEventListener(
        "openTeamDetails",
        handleOpenTeamDetails as EventListener
      );
    };
  }, [openDetailsModal]);

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

      <TeamDetailsModal
        open={detailsModalOpen}
        onClose={closeDetailsModal}
        teamMemberId={selectedTeamMemberId}
      />
    </PageLayout>
  );
}
