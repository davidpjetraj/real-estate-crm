import { useCallback, useContext, useEffect, useMemo } from "react";
import ConfirmContext from "./ConfirmContext";
import { ConfirmOptions } from "./types";

let idCounter = 0;

const useConfirmId = (): string => {
  return useMemo(() => `confirm-${idCounter++}`, []);
};

const useConfirm = () => {
  const parentId = useConfirmId();
  const { confirm, closeOnParentUnmount } = useContext(ConfirmContext);

  const triggerConfirm = useCallback(
    (options: ConfirmOptions) => confirm(options),
    [confirm]
  );

  useEffect(() => {
    return () => closeOnParentUnmount(parentId);
  }, [parentId, closeOnParentUnmount]);

  return triggerConfirm;
};

export default useConfirm;
