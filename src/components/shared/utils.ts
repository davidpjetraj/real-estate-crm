import dayjs from "dayjs";

export const djs = dayjs;

export type OptionProps = {
  value: any;
  label: string;
  color?: string;
};

export const sortOptions: OptionProps[] = [
  { label: "ASC", value: "asc" },
  { label: "DESC", value: "desc" },
];

export const defaultValue: OptionProps = {
  label: "-",
  value: null,
  color: "#ccc",
};
