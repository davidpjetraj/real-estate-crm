"use client";

import React, { useEffect } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import { Table } from "@/components/Table";
import { Button } from "@mui/material";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { useProperty, propertyColumns } from "../../../store/useProperties";
import { useRouter } from "next/navigation";
// import { CreateTeamMemberDialog } from "@/components/Dialog";
import PropertyDetailsComponent from "@/components/Property/PropertyDetailsComponent";

export default function PropertyPage() {
  const router = useRouter();
  //   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const getData = useProperty((state) => state.getData);
  //   const addItem = useProperty((state) => state.addItem);

  useEffect(() => {
    getData();
  }, [getData]);

  //   const handleAddProperty = () => {
  //     setIsCreateDialogOpen(true);
  //   };

  //   const handleCloseCreateDialog = () => {
  //     setIsCreateDialogOpen(false);
  //   };

  return (
    <PageLayout title="Property" showProfile={true}>
      <Table
        columns={propertyColumns}
        store={useProperty}
        rightActions={
          <Button
            variant="contained"
            size="medium"
            startIcon={<PlusIcon width={16} height={16} />}
            onClick={() => {
              router.push("/property/create");
            }}
          >
            Add Property
          </Button>
        }
      />

      {/* <CreateTeamMemberDialog
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        onSuccess={addItem}
      /> */}

      {/* Property Details Component */}
      <PropertyDetailsComponent />
    </PageLayout>
  );
}
