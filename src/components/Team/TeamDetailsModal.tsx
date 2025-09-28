"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { TeamModel } from "@/lib/graphql/generated/graphql";
import { useTeam } from "../../../store/useTeam";
import TeamDetailsWithActivities from "./TeamDetailsWithActivities";

interface TeamDetailsModalProps {
  open: boolean;
  onClose: () => void;
  teamMemberId: string | null;
}

export default function TeamDetailsModal({
  open,
  onClose,
  teamMemberId,
}: TeamDetailsModalProps) {
  const [teamMember, setTeamMember] = useState<TeamModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTeamDetails = useTeam((state) => state.getTeamDetails);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (!teamMemberId || !open) return;

      setLoading(true);
      setError(null);
      setTeamMember(null);

      try {
        const result = await getTeamDetails(teamMemberId);
        setTeamMember(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch team member details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [teamMemberId, open, getTeamDetails]);

  const handleClose = () => {
    setTeamMember(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: "95vh",
          height: "95vh",
          minWidth: { xs: "100%", md: "1200px" },
          width: { xs: "100%", md: "auto" },
          margin: { xs: 0, md: "auto" },
        },
      }}
    >
      <DialogContent sx={{ p: 0, overflow: "hidden", height: "100%" }}>
        {loading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
          >
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box sx={{ p: 3 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Box>
        )}

        {!loading && !error && !teamMember && (
          <Box sx={{ p: 3 }}>
            <Alert severity="info">Team member not found</Alert>
          </Box>
        )}

        {!loading && !error && teamMember && (
          <TeamDetailsWithActivities
            teamMember={teamMember}
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
