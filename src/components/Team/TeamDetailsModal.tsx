"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import { CloseIcon } from "@/components/icons/Close";
import { TeamModel } from "@/lib/graphql/generated/graphql";
import { useTeam } from "../../../store/useTeam";
import TeamDetails from "./TeamDetails";

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
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: "90vh",
          height: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 1,
        }}
      >
        Team Member Details
        <IconButton
          onClick={handleClose}
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
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0, overflow: "auto" }}>
        <Box sx={{ p: 3 }}>
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
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && !teamMember && (
            <Alert severity="info">Team member not found</Alert>
          )}

          {!loading && !error && teamMember && (
            <TeamDetails teamMember={teamMember} />
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
