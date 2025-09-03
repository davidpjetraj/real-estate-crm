export interface SettingsValueProps {
  themeMode: "light" | "dark";
  themeDirection: "ltr" | "rtl";
  themeColorPresets: string;
  themeStretch: boolean;
  themeLayout: "vertical" | "horizontal" | "mini";
  open: boolean;
  helpCenter: boolean;
}

export interface SettingsContextProps extends SettingsValueProps {
  onUpdate: (name: string, value: string | number | boolean) => void;
  onReset: () => void;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  onToggleHelp: () => void;
}
