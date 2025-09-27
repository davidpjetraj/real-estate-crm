"use client";

import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useConfigData, useConfigOptions } from "@/hooks/use-config";

/**
 * Example component showing how to use the config system
 * This can be used as a reference for other components
 */
export function ConfigExample() {
  const { users, states, cities, streets, loading, error, loadConfig } =
    useConfigData();

  const { userOptions, stateOptions, cityOptions, streetOptions } =
    useConfigOptions();

  if (loading) {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        <CircularProgress size={20} />
        <Typography>Loading configuration...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={<button onClick={loadConfig}>Retry</button>}
      >
        Failed to load configuration: {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Configuration Data
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        gap={2}
      >
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Users ({users.length})
          </Typography>
          <List dense>
            {userOptions.slice(0, 3).map((user) => (
              <ListItem key={user.value}>
                <ListItemText primary={user.label} secondary={user.email} />
              </ListItem>
            ))}
            {users.length > 3 && (
              <ListItem>
                <ListItemText secondary={`... and ${users.length - 3} more`} />
              </ListItem>
            )}
          </List>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            States ({states.length})
          </Typography>
          <List dense>
            {stateOptions.slice(0, 3).map((state) => (
              <ListItem key={state.value}>
                <ListItemText primary={state.label} />
              </ListItem>
            ))}
            {states.length > 3 && (
              <ListItem>
                <ListItemText secondary={`... and ${states.length - 3} more`} />
              </ListItem>
            )}
          </List>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Cities ({cities.length})
          </Typography>
          <List dense>
            {cityOptions.slice(0, 3).map((city) => (
              <ListItem key={city.value}>
                <ListItemText primary={city.label} />
              </ListItem>
            ))}
            {cities.length > 3 && (
              <ListItem>
                <ListItemText secondary={`... and ${cities.length - 3} more`} />
              </ListItem>
            )}
          </List>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Streets ({streets.length})
          </Typography>
          <List dense>
            {streetOptions.slice(0, 3).map((street) => (
              <ListItem key={street.value}>
                <ListItemText primary={street.label} />
              </ListItem>
            ))}
            {streets.length > 3 && (
              <ListItem>
                <ListItemText
                  secondary={`... and ${streets.length - 3} more`}
                />
              </ListItem>
            )}
          </List>
        </Box>
      </Box>
    </Box>
  );
}

export default ConfigExample;
