import { ClientStatus } from "@/lib/graphql/generated/graphql";

export interface TabConfig {
  label: string;
  value: string | number;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const getClientStatus = (
  status: ClientStatus,
  changeClientStatus: (status: ClientStatus) => void
) => {
  return [
    {
      label: "Active",
      value: ClientStatus.Active,
      isActive: status === ClientStatus.Active,
      onClick: () => changeClientStatus(ClientStatus.Active),
      disabled: status === ClientStatus.Active,
    },
    {
      label: "Archived",
      value: ClientStatus.Deactivated,
      isActive: status === ClientStatus.Deactivated,
      onClick: () => changeClientStatus(ClientStatus.Deactivated),
      disabled: status === ClientStatus.Deactivated,
    },
  ];
};

export const getPropertyStatus = (
  changeArchivedStatus: (archived: boolean) => void,
  archived?: boolean
) => {
  return [
    {
      label: "Active",
      value: "active",
      isActive: !archived,
      onClick: () => changeArchivedStatus(false),
      disabled: !archived,
    },
    {
      label: "Archived",
      value: "archived",
      isActive: archived === true,
      onClick: () => changeArchivedStatus(true),
      disabled: archived === true,
    },
  ];
};
