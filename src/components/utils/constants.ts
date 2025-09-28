export type OptionProps = {
  value: any;
  label: string;
  color?: string;
};

export const teamStatuses: OptionProps[] = [
  { label: "Active", value: "active", color: "#039855" },
  { label: "Deactivated", value: "deactivated", color: "#DA1833" },
  { label: "Invited", value: "invited", color: "#0BA5EC" },
];
