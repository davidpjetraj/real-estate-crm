"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import SidebarDetails from "@/components/SidebarDetails";
import { CloseIcon } from "@/components/icons/Close";
import useParams from "@/hooks/useParams";
import { Button, styled, IconButton, Grid } from "@mui/material";
import Scrollbars from "react-custom-scrollbars-2";
import {
  ActivityCreatedFor,
  ActivityType,
  PropertyModel,
  useActivitiesQuery,
} from "@/lib/graphql/generated/graphql";
import { toast } from "sonner";
import Activity from "../Activities/Activity";
import AddComment from "../Activities/AddComment";
import { useProperty } from "../../../store/useProperties";
import SkeletonLoader from "../Form/Loader/SkeletonLoader";
import PropertyDetails from "./PropertyDetails";

const Wrapper = styled("div")`
  border-right: 1px solid ${({ theme }) => theme.palette.divider};
  position: relative;
  .content {
    padding: 8px 16px;
    height: 100%;
  }
`;

const Details = () => {
  const [showActivities, setShowActivities] = useState(false);
  const { clearParams, id } = useParams({ type: "property" });

  const [propertyData, setPropertyData] = useState<PropertyModel>();
  const [isDataReady, setIsDataReady] = useState(false);
  const getPropertyDetailsFromStore = useProperty(
    (state) => state.getPropertyDetails
  );

  const getPropertyDetails = useCallback(
    async (id: string) => {
      return getPropertyDetailsFromStore(id);
    },
    [getPropertyDetailsFromStore]
  );

  const { data: activityData, loading: activityLoading } = useActivitiesQuery({
    variables: {
      input: {
        id: id,
        created_for: ActivityCreatedFor.Property,
      },
    },
    skip: !id,
  });

  const [propertyLoading, setPropertyLoading] = useState(false);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!id) {
        setPropertyData(undefined);
        setIsDataReady(false);
        return;
      }

      setPropertyLoading(true);
      setIsDataReady(false);

      try {
        const result = await getPropertyDetails(id);
        setPropertyData(result);
        setIsDataReady(true);
      } catch (error) {
        console.error("Error fetching property details:", error);
        toast.error("Error loading property");
        setPropertyData(undefined);
        setIsDataReady(true); // Set to true to stop loading even on error
      } finally {
        setPropertyLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id, getPropertyDetails]); // Include getPropertyDetails since it's memoized

  const activitiesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    activitiesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    setIsDataReady(false);
  }, [id]);

  if (propertyLoading || !isDataReady) {
    return <SkeletonLoader />;
  }

  if (!propertyData) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Property not found
      </div>
    );
  }

  return (
    <>
      <SidebarDetails.Header
        title={
          propertyData
            ? propertyData.title || `Property #${propertyData.short_id}`
            : "Property Details"
        }
      >
        <Button
          variant="outlined"
          onClick={() => setShowActivities(!showActivities)}
          sx={{
            marginLeft: "60px",
            minWidth: "inherit",
            maxHeight: "40px",
            display: { md: "none", xs: "flex" },
          }}
        >
          {showActivities ? "Details" : "Activities"}
        </Button>
        <IconButton onClick={clearParams} size="small">
          <CloseIcon width={20} height={20} />
        </IconButton>
      </SidebarDetails.Header>

      <SidebarDetails.Content
        style={{
          padding: 0,
        }}
      >
        <Grid container>
          <Grid
            size={{ xs: 12, md: 7.5 }}
            sx={{
              display: { xs: showActivities ? "none" : "block", md: "block" },
            }}
          >
            <Wrapper>
              <Scrollbars
                style={{
                  width: "100%",
                  height: `calc(100dvh - 82px)`,
                }}
              >
                <div className="content">
                  {propertyData && <PropertyDetails property={propertyData} />}
                </div>
              </Scrollbars>
            </Wrapper>
          </Grid>

          <Grid
            size={{ xs: 12, md: 4.5 }}
            sx={{
              display: {
                xs: showActivities ? "block" : "none",
                md: "block",
              },
            }}
          >
            <Activity
              id={id}
              data={activityData}
              loading={activityLoading}
              created_for={ActivityCreatedFor.Property}
            />
            <div ref={activitiesEndRef} />
            <AddComment
              scrollToBottom={scrollToBottom}
              created_for={ActivityCreatedFor.Property}
              action={ActivityType.Comment}
              id={id}
            />
          </Grid>
        </Grid>
      </SidebarDetails.Content>
    </>
  );
};

export default function PropertyDetailsComponent() {
  return (
    <SidebarDetails type="property" maxWith={1920}>
      <Details />
    </SidebarDetails>
  );
}
