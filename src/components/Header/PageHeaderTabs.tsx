import {
  Button,
  ButtonProps,
  MenuItem,
  Select,
  SelectChangeEvent,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import PageTabs from "./PageTabs";

interface Tab {
  label: string;
  value: string | number;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

interface PageTabsProps {
  tabs: Tab[];
  buttonProps?: ButtonProps;
}

function PageHeaderTabs({ tabs, buttonProps }: PageTabsProps) {
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const activeTab = tabs.find((tab) => tab.isActive);

  const handleSelectChange = (event: SelectChangeEvent<string | number>) => {
    const selectedTab = tabs.find((tab) => tab.value === event.target.value);
    if (selectedTab && !selectedTab.disabled) {
      selectedTab.onClick();
    }
  };

  return isMobile ? (
    <Select
      value={activeTab?.value || ""}
      onChange={handleSelectChange}
      displayEmpty
      variant="outlined"
      size="small"
      fullWidth
      sx={{
        minWidth: 130,
        maxWidth: 150,
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "divider",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "divider",
        },
      }}
    >
      {tabs.map((tab) => (
        <MenuItem sx={{ margin: "4px" }} key={tab.value} value={tab.value}>
          {tab.label}
        </MenuItem>
      ))}
    </Select>
  ) : (
    <PageTabs>
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          variant="text"
          size="small"
          className={tab.isActive ? "active" : ""}
          onClick={tab.onClick}
          disabled={tab.disabled}
          {...buttonProps}
        >
          {tab.label}
        </Button>
      ))}
    </PageTabs>
  );
}

export default PageHeaderTabs;
