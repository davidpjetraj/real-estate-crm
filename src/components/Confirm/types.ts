import { ReactNode } from 'react';

export interface ConfirmOptions {
  icon?: ReactNode;
  title?: string;
  description?: string;
  content?: ReactNode;
  confirmationText?: string;
  cancellationText?: string;
  dialogProps?: object;
  dialogActionsProps?: object;
  confirmationButtonProps?: object;
  cancellationButtonProps?: object;
  contentProps?: object;
  allowClose?: boolean;
  confirmationKeywordTextFieldProps?: object;
  hideCancelButton?: boolean;
  buttonOrder?: string[];
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => void;
  closeOnParentUnmount: (id: string) => void;
}
