import { djs } from "@/components/shared/utils";
import { styled } from "@mui/material";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import React from "react";
import { TableColumn } from "../../components/Table";
import { IDataStore } from "../../interfaces/DataStore";

const Wrapper = styled("div")`
  width: 100%;

  input {
    height: 42px !important;
    box-sizing: border-box;
  }
`;

export default function DateRange({
  data,
  store,
}: {
  data: TableColumn<any>;
  store: any;
}) {
  const { updateFilterItem } = store((state: IDataStore) => state);
  const [value, setValue] = React.useState<any>([
    djs(data?.value?.[0]),
    djs(data?.value?.[1]),
  ]);

  const onChange = (ranges: any) => {
    setValue(ranges);
    updateFilterItem({
      ...data,
      value: ranges,
    });
  };

  return (
    <Wrapper>
      <DateRangePicker
        key={data.id}
        value={value}
        onAccept={(newValue) => onChange(newValue)}
        slotProps={{
          textField: {
            variant: "outlined",
            label: null,
          },
          popper: {
            disablePortal: true,
          },
        }}
        format="DD/MM/YYYY"
      />
    </Wrapper>
  );
}
