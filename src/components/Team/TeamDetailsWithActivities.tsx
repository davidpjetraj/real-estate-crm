"use client";

import React, { useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  TeamModel,
  ActivityCreatedFor,
  ActivityType,
  useActivitiesQuery,
} from "@/lib/graphql/generated/graphql";
import { CloseIcon } from "@/components/icons/Close";
import TeamDetails from "./TeamDetails";
import Activity from "../Activities/Activity";
import AddComment from "../Activities/AddComment";

const LayoutWrapper = styled(Box)`
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const LeftPanel = styled(Box)`
  width: 40%;
  min-width: 400px;
  background: ${({ theme }) => theme.palette.background.paper};
  border-right: 1px solid ${({ theme }) => theme.palette.divider};
  overflow-y: auto;
  padding: 24px;

  @media (max-width: 1024px) {
    width: 100%;
    min-width: unset;
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
    max-height: 50%;
    padding: 16px;
  }
`;

const RightPanel = styled(Box)`
  width: 60%;
  background: ${({ theme }) => theme.palette.background.default};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 1024px) {
    width: 100%;
    flex: 1;
  }
`;

const ActivitiesHeader = styled(Box)`
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  background: ${({ theme }) => theme.palette.background.paper};
  display: flex;
  align-items: center;
  justify-content: between;
  gap: 16px;
`;

const ActivitiesContent = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ActivitiesScrollArea = styled(Box)`
  flex: 1;
  overflow-y: auto;
`;

const Header = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  background: ${({ theme }) => theme.palette.background.paper};
`;

interface TeamDetailsWithActivitiesProps {
  teamMember: TeamModel;
  onClose?: () => void;
}

export default function TeamDetailsWithActivities({
  teamMember,
  onClose,
}: TeamDetailsWithActivitiesProps) {
  const activitiesEndRef = useRef<HTMLDivElement>(null);

  // Fetch activities for this team member
  const { data: activitiesData, loading: activitiesLoading } =
    useActivitiesQuery({
      variables: {
        input: {
          id: teamMember.id,
          created_for: ActivityCreatedFor.User,
        },
      },
      skip: !teamMember.id,
    });

  const scrollToBottom = () => {
    activitiesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Header>
        <Typography variant="h5" component="h1" fontWeight="600">
          {teamMember.name ||
            `${teamMember.first_name} ${teamMember.last_name}`}
        </Typography>
        {onClose && (
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: "text.secondary",
              "&:hover": {
                color: "text.primary",
              },
            }}
          >
            <CloseIcon width={20} height={20} />
          </IconButton>
        )}
      </Header>

      {/* Main Layout */}
      <LayoutWrapper sx={{ flex: 1 }}>
        {/* Left Panel - Team Details */}
        <LeftPanel>
          <TeamDetails teamMember={teamMember} />
        </LeftPanel>

        {/* Right Panel - Activities */}
        <RightPanel>
          {/* Activities Header */}
          <ActivitiesHeader>
            <Typography variant="h6" fontWeight="600">
              Activities & Comments
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {activitiesData?.activities?.length || 0} activities
            </Typography>
          </ActivitiesHeader>

          {/* Activities Content */}
          <ActivitiesContent>
            <ActivitiesScrollArea>
              <Activity
                id={teamMember.id}
                data={activitiesData}
                loading={activitiesLoading}
                created_for={ActivityCreatedFor.User}
                activitiesEndRef={activitiesEndRef}
              />
              <div ref={activitiesEndRef} />
            </ActivitiesScrollArea>

            {/* Add Comment Section */}
            <Box sx={{ borderTop: 1, borderColor: "divider" }}>
              <AddComment
                scrollToBottom={scrollToBottom}
                created_for={ActivityCreatedFor.User}
                action={ActivityType.Comment}
                id={teamMember.id}
              />
            </Box>
          </ActivitiesContent>
        </RightPanel>
      </LayoutWrapper>
    </Box>
  );
}
