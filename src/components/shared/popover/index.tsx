"use client";

import { useState, useCallback } from "react";
import { Popover, PopoverProps } from "@mui/material";

export interface UsePopoverProps {
  defaultOpen?: boolean;
  vertical?: "top" | "center" | "bottom";
  horizontal?: "left" | "center" | "right";
}

export function usePopover(props?: UsePopoverProps) {
  const [open, setOpen] = useState(props?.defaultOpen || false);

  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  const onToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return {
    open,
    onOpen,
    onClose,
    onToggle,
  };
}

interface CustomPopoverProps extends Omit<PopoverProps, "open"> {
  open: boolean;
  onClose: () => void;
}

export function CustomPopover({
  open,
  onClose,
  children,
  ...other
}: CustomPopoverProps) {
  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        sx: {
          mt: 1,
          overflow: "inherit",
          border: (theme) => `solid 1px ${theme.palette.divider}`,
          width: 240,
        },
      }}
      {...other}
    >
      {children}
    </Popover>
  );
}
