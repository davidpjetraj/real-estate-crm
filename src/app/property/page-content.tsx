"use client";

import React, { useEffect, useMemo } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import { Table } from "@/components/Table";
import { Button } from "@mui/material";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { useProperty, propertyColumns } from "../../../store/useProperties";
import { useRouter } from "next/navigation";
// import { CreateTeamMemberDialog } from "@/components/Dialog";
import PropertyDetailsComponent from "@/components/Property/PropertyDetailsComponent";
import PageHeaderTabs from "@/components/Header/PageHeaderTabs";
import { getPropertyStatus } from "@/components/Header/tabUitls";
import { useShallow } from "zustand/react/shallow";

export default function PropertyPage() {
  const router = useRouter();
  //   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const getData = useProperty((state) => state.getData);
  const { changeArchivedStatus, archived } = useProperty(
    useShallow((state) => state)
  );
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

  const tabs = useMemo(
    () => getPropertyStatus(changeArchivedStatus, archived),
    [changeArchivedStatus, archived]
  );
  return (
    <PageLayout title="Property" showProfile={true}>
      <Table
        columns={propertyColumns}
        store={useProperty}
        afterActions={<PageHeaderTabs tabs={tabs} />}
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
