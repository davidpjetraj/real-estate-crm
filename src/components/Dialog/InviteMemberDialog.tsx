"use client";

import { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { Dialog } from "./Dialog";

interface InviteMemberDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function InviteMemberDialog({
  open,
  onClose,
}: InviteMemberDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    // TODO: Add invite member logic here
    console.log("Inviting member:", { name, email });

    // Reset form
    setName("");
    setEmail("");

    // Close dialog
    onClose();
  };

  const handleClose = () => {
    // Reset form when closing
    setName("");
    setEmail("");
    onClose();
  };

  return (
    <Dialog open={open} setOpen={handleClose}>
      <Dialog.Title title="Invite Member" onClose={handleClose} />
      <Dialog.Content>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Name"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            fullWidth
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Box>
      </Dialog.Content>
      <Dialog.Actions>
        <div className="right">
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!name.trim() || !email.trim()}
          >
            Send Invite
          </Button>
        </div>
      </Dialog.Actions>
    </Dialog>
  );
}
