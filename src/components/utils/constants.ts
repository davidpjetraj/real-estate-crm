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

export const propertyStatuses: OptionProps[] = [
  { label: "Active", value: "active", color: "#039855" },
  {
    label: "Property Development",
    value: "property_development",
    color: "#0BA5EC",
  },
  { label: "Rented", value: "rented", color: "#ff9800" },
  { label: "Rented By Owner", value: "rented_by_owner", color: "#0BA5EC" },
  { label: "Sold", value: "sold", color: "#4caf50" },
  { label: "Sold By Owner", value: "sold_by_owner", color: "#0BA5EC" },
  {
    label: "Withdrawn By Owner",
    value: "withdrawn_by_owner",
    color: "#DA1833",
  },
];
