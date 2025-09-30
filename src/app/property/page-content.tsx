"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { prepareFilters } from "@/components/Table/utils";
import { apolloClient } from "@/lib/graphql/ApolloWrapper";
import { ExportPropertiesDocument, usePropertyCreatedSubscription, usePropertyRemovedRestoreSubscription, usePropertyStatusUpdatedListSubscription, usePropertyUpdatedSubscription } from "@/lib/graphql/generated/graphql";
import { toast } from "sonner";
import { LoadingButton } from "@/components/LoadingButton";
import { CloudUploadIcon } from "@/components/icons/CloudUploadIcon";

export default function PropertyPage() {
  const router = useRouter();
  const [exportLoading, setExportLoading] = useState(false);
  const { addItem, updateItem, removeItem } = useProperty((state) => state);
  const getData = useProperty((state) => state.getData);
  const { changeArchivedStatus, archived, filters, search } = useProperty(
    useShallow((state) => state)
  );

  useEffect(() => {
    getData();
  }, [getData]);


  const tabs = useMemo(
    () => getPropertyStatus(changeArchivedStatus, archived),
    [changeArchivedStatus, archived]
  );


  const handleExportClients = async () => {
    try {
      setExportLoading(true);

      const buildFilters = prepareFilters(filters);

      const result = await apolloClient.query({
        query: ExportPropertiesDocument,
        variables: {
          input: {
            filters: buildFilters,
            search: search || null,
          },
        },
        fetchPolicy: 'no-cache',
      });

      if (result.data?.exportProperties) {
        const filePath = result.data.exportProperties;

        if (!filePath || typeof filePath !== 'string') {
          throw new Error('Invalid export data received from the server');
        }

        const fileUrl = `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${filePath}`;

        const link = document.createElement('a');
        link.href = fileUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error('No export data received from the server');
      }
      toast.success('Properties successfully exported');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(
        error instanceof Error
          ? error.message
        : 'Export failed. Please try again.',
      );
    } finally {
      setExportLoading(false);
    }
  };

usePropertyCreatedSubscription({
  onData: (data) => {
    if (data.data?.data?.propertyCreated) {
      addItem(data.data.data.propertyCreated);
    }
  },
});

usePropertyRemovedRestoreSubscription({
  skip: false,
  onData: (data) => {
    if (data.data?.data?.propertyRemovedRestore) {
      addItem(data.data.data.propertyRemovedRestore);
    }
  },
});
usePropertyRemovedRestoreSubscription({
  skip: false,
  onData: (data) => {
    if (data.data?.data?.propertyRemovedRestore) {
      removeItem(data.data.data.propertyRemovedRestore.id);
    }
  },
});

usePropertyCreatedSubscription({
  onData: (data) => {
    if (data.data?.data?.propertyCreated) {
      addItem(data.data.data.propertyCreated);
    }
  },
});

usePropertyStatusUpdatedListSubscription({
  skip: false,
  onData: (data) => {
    if (data.data?.data?.propertyStatusUpdatedList) {
      updateItem(data.data.data.propertyStatusUpdatedList);
    }
  },
});


usePropertyUpdatedSubscription({
  skip: false,
  onData: (data) => {
    if (data.data?.data?.propertyUpdated) {
      updateItem(data.data.data.propertyUpdated);
    }
  },
});

usePropertyRemovedRestoreSubscription({
  skip: false,
  onData: (data) => {
    if (data.data?.data?.propertyRemovedRestore) {
      removeItem(data.data.data.propertyRemovedRestore.id);
    }
  },
});





  return (
    <PageLayout title="Property" showProfile={true}>
      <Table
        columns={propertyColumns}
        store={useProperty}
        afterActions={<PageHeaderTabs tabs={tabs} />}
        rightActions={
          <div style={{ display: "flex", gap: "10px" }}>
              <LoadingButton
                variant="outlined"
                size="small"
                startIcon={<CloudUploadIcon width={16} height={16} />}
                onClick={handleExportClients}
                loading={exportLoading}
                className="export-button"
                disabled={exportLoading}>
                Export
              </LoadingButton>
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
          </div>
        }
      />

      {/* Property Details Component */}
      <PropertyDetailsComponent />
    </PageLayout>
  );
}
