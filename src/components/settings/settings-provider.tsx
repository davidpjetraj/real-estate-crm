import { useMemo, useState, useCallback } from "react";
import { SettingsContext } from "./settings-context";
import { SettingsValueProps } from "./types";
import useLocalStorage from "../../hooks/use-local-storage";

type SettingsProviderProps = {
  children: React.ReactNode;
  defaultSettings: SettingsValueProps;
};

const STORAGE_KEY = "client-settings";

export function SettingsProvider({
  children,
  defaultSettings,
}: SettingsProviderProps) {
  const [state, update, reset] = useLocalStorage(STORAGE_KEY, defaultSettings);

  const [openDrawer, setOpenDrawer] = useState(defaultSettings.open);
  const [helpCenter, setHelpCenter] = useState(defaultSettings.helpCenter);

  // Drawer
  const onOpenDrawer = useCallback(() => {
    setOpenDrawer(true);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setOpenDrawer(false);
  }, []);

  const onToggleDrawer = useCallback(() => {
    setOpenDrawer((prev) => {
      if (!prev) {
        setHelpCenter(false);
      }
      return !prev;
    });
  }, []);

  const onToggleHelp = useCallback(() => {
    setHelpCenter((prev) => !prev);
  }, []);

  const onUpdate = useCallback(
    (name: string, value: string | number | boolean) => {
      update((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [update]
  );

  const memoizedValue = useMemo(
    () => ({
      ...state,
      onUpdate: onUpdate,
      onReset: reset,
      open: openDrawer,
      helpCenter: helpCenter,
      onOpen: onOpenDrawer,
      onClose: onCloseDrawer,
      onToggle: onToggleDrawer,
      onToggleHelp: onToggleHelp,
    }),
    [
      state,
      openDrawer,
      helpCenter,
      onCloseDrawer,
      onOpenDrawer,
      onToggleDrawer,
      onToggleHelp,
      onUpdate,
      reset,
    ]
  );

  return (
    <SettingsContext.Provider value={memoizedValue}>
      {children}
    </SettingsContext.Provider>
  );
}
