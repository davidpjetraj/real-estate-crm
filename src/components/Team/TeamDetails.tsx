"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import { TeamModel } from "@/lib/graphql/generated/graphql";
import LocationIcon from "@/components/icons/LocationIcon";
import { MailIcon } from "@/components/icons/MailIcon";
import CalendarIcon from "@/components/icons/CalendarIcon";
import { UserSquareIcon } from "@/components/icons/UserSquareIcon";

interface TeamDetailsProps {
  teamMember: TeamModel;
}

export default function TeamDetails({ teamMember }: TeamDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatBirthday = (birthday: any) => {
    if (!birthday) return "Not provided";
    return new Date(birthday).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "invited":
        return "warning";
      case "deactivated":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Box>
      {/* Header Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar
              src={teamMember.avatar || undefined}
              sx={{ width: 80, height: 80 }}
            >
              {teamMember.first_name?.[0]}
              {teamMember.last_name?.[0]}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h4" component="h1" gutterBottom>
                {teamMember.name ||
                  `${teamMember.first_name} ${teamMember.last_name}`}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {teamMember.email}
              </Typography>
              <Chip
                label={getStatusLabel(teamMember.status)}
                color={getStatusColor(teamMember.status) as any}
                size="small"
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Details Layout */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Top Row - Personal and Contact Information */}
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          {/* Personal Information */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <UserSquareIcon width={20} height={20} />
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ "& > *": { mb: 2 } }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      First Name
                    </Typography>
                    <Typography variant="body1">
                      {teamMember.first_name || "Not provided"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Last Name
                    </Typography>
                    <Typography variant="body1">
                      {teamMember.last_name || "Not provided"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Birthday
                    </Typography>
                    <Typography variant="body1">
                      {formatBirthday(teamMember.birthday)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Member Since
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(teamMember.created_at)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Contact Information */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <MailIcon width={20} height={20} />
                  Contact Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ "& > *": { mb: 2 } }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email Address
                    </Typography>
                    <Typography variant="body1">
                      {teamMember.email || "Not provided"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phone Number
                    </Typography>
                    <Typography variant="body1">
                      {teamMember.phone || "Not provided"}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Location Information */}
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <LocationIcon width={20} height={20} />
              Location Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary">
                  State
                </Typography>
                <Typography variant="body1">
                  {teamMember.state?.name || "Not provided"}
                </Typography>
              </Box>

              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary">
                  City
                </Typography>
                <Typography variant="body1">
                  {teamMember.city?.name || "Not provided"}
                </Typography>
              </Box>

              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary">
                  Street
                </Typography>
                <Typography variant="body1">
                  {teamMember.street?.name || "Not provided"}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <CalendarIcon width={20} height={20} />
              System Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary">
                  Account Status
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={getStatusLabel(teamMember.status)}
                    color={getStatusColor(teamMember.status) as any}
                    size="small"
                  />
                </Box>
              </Box>

              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body1">
                  {formatDate(teamMember.created_at)}
                </Typography>
              </Box>

              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary">
                  Deleted
                </Typography>
                <Typography variant="body1">
                  {teamMember.deleted ? "Yes" : "No"}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
