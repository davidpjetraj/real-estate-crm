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
  TeamModel,
  useActivitiesQuery,
} from "@/lib/graphql/generated/graphql";
import { toast } from "sonner";
import Activity from "../Activities/Activity";
import AddComment from "../Activities/AddComment";
import TeamDetails from "./TeamDetails";
import { useTeam } from "../../../store/useTeam";
import SkeletonLoader from "../Form/Loader/SkeletonLoader";

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
  const { clearParams, id } = useParams({ type: "team" });

  const [teamData, setTeamData] = useState<TeamModel>();
  const [isDataReady, setIsDataReady] = useState(false);
  const getTeamDetailsFromStore = useTeam((state) => state.getTeamDetails);

  const getTeamDetails = useCallback(
    async (id: string) => {
      return getTeamDetailsFromStore(id);
    },
    [getTeamDetailsFromStore]
  );

  const { data: activityData, loading: activityLoading } = useActivitiesQuery({
    variables: {
      input: {
        id: id,
        created_for: ActivityCreatedFor.User,
      },
    },
    skip: !id,
  });

  const [teamLoading, setTeamLoading] = useState(false);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (!id) {
        setTeamData(undefined);
        setIsDataReady(false);
        return;
      }

      setTeamLoading(true);
      setIsDataReady(false);

      try {
        const result = await getTeamDetails(id);
        setTeamData(result);
        setIsDataReady(true);
      } catch (error) {
        console.error("Error fetching team details:", error);
        toast.error("Error loading team member");
        setTeamData(undefined);
        setIsDataReady(true); // Set to true to stop loading even on error
      } finally {
        setTeamLoading(false);
      }
    };

    fetchTeamDetails();
  }, [id, getTeamDetails]); // Include getTeamDetails since it's memoized

  const activitiesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    activitiesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    setIsDataReady(false);
  }, [id]);

  if (teamLoading || !isDataReady) {
    return <SkeletonLoader />;
  }

  if (!teamData) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Team member not found
      </div>
    );
  }

  return (
    <>
      <SidebarDetails.Header
        title={
          teamData
            ? teamData.name || `${teamData.first_name} ${teamData.last_name}`
            : "Team Member Details"
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
                  {teamData && <TeamDetails teamMember={teamData} />}
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
              created_for={ActivityCreatedFor.User}
            />
            <div ref={activitiesEndRef} />
            <AddComment
              scrollToBottom={scrollToBottom}
              created_for={ActivityCreatedFor.User}
              action={ActivityType.Comment}
              id={id}
            />
          </Grid>
        </Grid>
      </SidebarDetails.Content>
    </>
  );
};

export default function TeamDetailsComponent() {
  return (
    <SidebarDetails type="team" maxWith={1920}>
      <Details />
    </SidebarDetails>
  );
}
