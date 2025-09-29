'use client';
import { useState, useCallback, ReactNode } from 'react';
import ConfirmContext from './ConfirmContext';
import ConfirmationDialog from './ConfirmationDialog';
import { ConfirmOptions } from './types';

interface ConfirmProviderProps {
  children: ReactNode;
  defaultOptions?: Partial<ConfirmOptions>;
}

const DEFAULT_OPTIONS: ConfirmOptions = {
  title: 'Are you sure?',
  description: '',
  content: null,
  confirmationText: 'Ok',
  cancellationText: 'Cancel',
  allowClose: true,
};

export const ConfirmProvider: React.FC<ConfirmProviderProps> = ({
  children,
  defaultOptions = {},
}) => {
  const [confirmState, setConfirmState] = useState<{
    options: ConfirmOptions;
  } | null>(null);

  const confirm = useCallback(
    (options: ConfirmOptions) => {
      setConfirmState({
        options: { ...DEFAULT_OPTIONS, ...defaultOptions, ...options },
      });
    },
    [defaultOptions],
  );

  const closeOnParentUnmount = useCallback(() => {
    setConfirmState(null);
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmState?.options.onConfirm) {
      confirmState.options.onConfirm();
    }
    setConfirmState(null);
  }, [confirmState]);

  const handleCancel = useCallback(() => {
    if (confirmState?.options.onCancel) {
      confirmState.options.onCancel();
    }
    setConfirmState(null);
  }, [confirmState]);

  return (
    <ConfirmContext.Provider value={{ confirm, closeOnParentUnmount }}>
      {children}
      {confirmState ? (
        <ConfirmationDialog
          open={true}
          options={confirmState.options}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      ) : null}
    </ConfirmContext.Provider>
  );
};

export default ConfirmProvider;
