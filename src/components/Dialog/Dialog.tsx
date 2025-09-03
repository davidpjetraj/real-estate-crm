"use client";
import MaterialDialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { CloseIcon } from "../icons/Close";

const BootstrapDialog = styled(MaterialDialog)(({ theme }) => ({
  h3: {
    fontSize: 18,
    fontWeight: 500,
  },

  p: {
    fontSize: 14,
    fontWeight: 400,
    color: theme.palette.text.secondary,
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(0),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(2),
  },
  "& .MuiPaper-root": {
    transition: "0.3s ease",
    position: "relative",
  },
  "& .MuiDialog-paperWidthFalse": {
    maxWidth: "355px",
  },
  "#dialog-title": {
    fontSize: 20,
    fontWeight: 600,
  },
}));

const BootstrapActions = styled(DialogActions)(({}) => ({
  padding: "24px !important",
  paddingTop: "16px !important",
  borderTop: "1px solid rgba(145, 158, 171, 0.2)",
  justifyContent: "space-between",
  "& .right": {
    display: "flex",
    alignItems: "center",
    width: "100%",
    gap: 8,
    margin: "0 !important",
  },
}));

const BootstrapContent = styled(DialogContent)(({ theme }) => ({
  padding: "0 24px !important",
  paddingTop: "12px !important",
  paddingBottom: "24px !important",
  height: "100%",

  h3: {
    fontSize: 18,
    fontWeight: 500,
    marginTop: 0,
    marginBottom: 8,
  },

  p: {
    fontSize: "14px",
    fontWeight: 400,
    color: theme.palette.text.secondary,
    marginTop: 0,
    marginBottom: "20px",
  },
}));

interface DialogTitleProps {
  title?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  iconStyle?: any;
}

const DialogTitle = ({
  title,
  onClose,
  style,
  iconStyle,
}: DialogTitleProps) => {
  return (
    <div
      style={{
        padding: 24,
        paddingBottom: "12px",
        maxHeight: 87,
        ...style,
      }}
    >
      {title}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 16,
            ...iconStyle,
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Dialog({ children, open, setOpen, ...rest }: any) {
  const handleClose = () => {
    if (setOpen) {
      setOpen(false);
    }
  };
  return (
    <BootstrapDialog
      fullWidth
      onClose={setOpen ? handleClose : null}
      aria-labelledby="title"
      open={open}
      {...rest}
    >
      {children}
    </BootstrapDialog>
  );
}

Dialog.Title = DialogTitle;
Dialog.Content = BootstrapContent;
Dialog.Actions = BootstrapActions;
