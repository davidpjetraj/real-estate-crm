"use client";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import useLockBody from "./useLockBody";

export type ParamsType = "team" | "client" | "property";

export type SetParams = {
  type: ParamsType;
  tab: string;
  id: string;
};

const useParams = (props?: { type?: ParamsType }) => {
  const [tab, setTab] = useQueryState("tab", {
    throttleMs: 0,
    history: "push",
  });
  const [type, setType] = useQueryState("type", {
    throttleMs: 0,
    history: "push",
  });
  const [id, setId] = useQueryState("id", {
    throttleMs: 0,
    history: "push",
  });

  const setParams = ({ type, tab, id }: SetParams) => {
    setType(type);
    setTab(tab);
    setId(id);
  };

  const [delayedIsOpen, setDelayedIsOpen] = useState<boolean>(false);

  const isOpen = type === props?.type && tab && id;

  const clearParams = () => {
    setTab(null);
    setType(null);
    setId(null);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isOpen) {
      setDelayedIsOpen(true); // Immediately set to true
    } else {
      timeout = setTimeout(() => {
        setDelayedIsOpen(false); // Delay the set to false by 300ms
      }, 300);
    }
    return () => clearTimeout(timeout); // Clean up timeout on unmount or if isOpen changes
  }, [isOpen]);

  // On ESC key press, close the modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearParams();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useLockBody(isOpen as boolean);

  return {
    clearParams,
    setParams,
    setTab,
    tab,
    type,
    id: id as string,
    open: !!isOpen,
    delayedOpen: delayedIsOpen,
  };
};

export default useParams;
