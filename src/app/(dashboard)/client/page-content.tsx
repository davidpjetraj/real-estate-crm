"use client";

import React, { useEffect, useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import { Table } from "@/components/Table";
import { Button } from "@mui/material";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { useClient, clientColumns } from "../../../../store/useClient";
import { CreateClientDialog } from "@/components/Dialog";

export default function ClientPage() {
  // const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const getData = useClient((state) => state.getData);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleAddClient = () => {
    setIsCreateDialogOpen(true);
  };

  // const handleEditClient = (client: any) => {
  //   router.push(`/client/edit/${client.id}`);
  // };

  // const handleDeleteClient = (client: any) => {
  //   if (window.confirm(`Are you sure you want to delete ${client.name}?`)) {
  //     clientStore.getState().removeItem(client.id);
  //   }
  // };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const addItem = useClient((state) => state.addItem);

  return (
    <PageLayout title="Clients" showProfile={true}>
      <Table
        columns={clientColumns}
        store={useClient}
        rightActions={
          <Button
            variant="contained"
            size="medium"
            startIcon={<PlusIcon width={16} height={16} />}
            onClick={handleAddClient}
          >
            Add Client
          </Button>
        }
      />

      <CreateClientDialog
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        onSuccess={addItem}
      />
    </PageLayout>
  );
}
