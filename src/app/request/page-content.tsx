"use client";

import React, { useEffect, useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import { Table } from "@/components/Table";
import { Button } from "@mui/material";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { requestColumns, useRequest } from "../../../store/useRequest";
import CreateRequestDialog from "@/components/Dialog/CreateRequestDialog";

export default function RequestPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const getData = useRequest((state) => state.getData);
  const addItem = useRequest((state) => state.addItem);

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
    <PageLayout title="Requests" showProfile={true}>
      <Table
        columns={requestColumns}
        store={useRequest}
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

      <CreateRequestDialog
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        onSuccess={addItem}
      />

      {/* <TeamDetailsComponent /> */}
    </PageLayout>
  );
}
