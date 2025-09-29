import { CloseIcon } from "@/components/icons/Close";
import { ErrorColorDeleteIcon } from "@/components/icons/ErrorColorDeleteIcon";
import { IconButton, styled } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { FC } from "react";
import StyledIcon from "../shared/StyledIcon";
import { ConfirmOptions } from "./types";

interface ConfirmationDialogProps {
  open: boolean;
  options: ConfirmOptions;
  onConfirm: () => void;
  onCancel: () => void;
}

interface DialogTitleProps {
  title?: React.ReactNode;
  onClose?: any;
}

const DialogTitle = ({ title, onClose = () => {} }: DialogTitleProps) => {
  return (
    <div
      style={{
        padding: 24,
        paddingBottom: 0,
      }}
    >
      <h4
        style={{
          margin: 0,
          fontSize: 20,
        }}
      >
        {title}
      </h4>
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 24,
            top: 24,
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </div>
  );
};

const BootstrapActions = styled(DialogActions)(({}) => ({
  padding: "24px",
  justifyContent: "space-between",
  "& .right": {
    display: "flex",
    alignItems: "center",
    gap: 8,
    margin: "0",
    width: "100%",
  },
  "& button": {
    flexGrow: 1,
    paddingTop: "10px",
  },
}));

const BootstrapContent = styled(DialogContent)(({}) => ({
  padding: "24px !important",
  paddingBottom: "0 !important",
  height: "100%",
}));

const ConfirmationDialog: FC<ConfirmationDialogProps> = ({
  open,
  options,
  onConfirm,
  onCancel,
}) => {
  const {
    icon,
    title,
    description,
    content,
    confirmationText,
    cancellationText,
    dialogProps,
    dialogActionsProps,
    confirmationButtonProps,
    cancellationButtonProps,
    contentProps,
    allowClose = true,
    hideCancelButton,
    buttonOrder = ["cancel", "confirm"],
  } = options;

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      {...dialogProps}
      onClose={allowClose ? onCancel : undefined}
    >
      {title && (
        <DialogTitle
          title={
            icon ? (
              icon
            ) : (
              <StyledIcon severity="error">
                <ErrorColorDeleteIcon />
              </StyledIcon>
            )
          }
          onClose={allowClose ? onCancel : undefined}
        />
      )}
      <BootstrapContent {...contentProps}>
        <h3 style={{ margin: "8px 0px" }}>{title}</h3>
        {description && <DialogContentText>{description}</DialogContentText>}
        {content}
      </BootstrapContent>
      <BootstrapActions {...dialogActionsProps}>
        <div className="left"></div>
        <div className="right">
          {buttonOrder.map((button) =>
            button === "confirm" ? (
              <Button
                key="confirm"
                {...confirmationButtonProps}
                onClick={onConfirm}
              >
                {confirmationText}
              </Button>
            ) : (
              !hideCancelButton && (
                <Button
                  key="cancel"
                  {...cancellationButtonProps}
                  onClick={onCancel}
                >
                  {cancellationText}
                </Button>
              )
            )
          )}
        </div>
      </BootstrapActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
