import CalendarIcon from "@/components/icons/CalendarIcon";
import { djs } from "@/components/shared/utils";
import { TableButton } from "@/components/Table";
import {
  DateRange,
  DateRangePicker,
  PickersShortcutsItem,
} from "@mui/x-date-pickers-pro";
import { Dayjs } from "dayjs";
import { useRef, useState } from "react";

interface DateFilterProps {
  onChange: (dates: string[]) => void;
  value: [Dayjs | null, Dayjs | null];
}

export function DateFilter({ onChange }: DateFilterProps) {
  const getDefaultDateRange = () => {
    const startOfMonth = djs().startOf("month");
    const endOfMonth = djs().endOf("month");
    return [startOfMonth, endOfMonth] as [Dayjs, Dayjs];
  };

  const [dateRangeValue, setDateRangeValue] = useState<
    [Dayjs | null, Dayjs | null]
  >(getDefaultDateRange());

  const shortcutsItems: PickersShortcutsItem<DateRange<Dayjs>>[] = [
    {
      label: "12 muajt e fundit",
      getValue: () => {
        const start = djs().subtract(12, "month");
        return [start, djs()];
      },
    },
    {
      label: "Muaji i kaluar",
      getValue: () => {
        const lastMonth = djs().subtract(1, "month");
        return [lastMonth.startOf("month"), lastMonth.endOf("month")];
      },
    },
    {
      label: "Këtë javë",
      getValue: () => {
        const today = djs();
        return [today.startOf("week"), today.endOf("week")];
      },
    },
    {
      label: "Javën e kaluar",
      getValue: () => {
        const today = djs();
        const prevWeek = today.subtract(7, "day");
        return [prevWeek.startOf("week"), prevWeek.endOf("week")];
      },
    },
    {
      label: "7 ditët e fundit",
      getValue: () => {
        const today = djs();
        return [today.subtract(7, "day"), today];
      },
    },
    {
      label: "Këte muaj",
      getValue: () => {
        const today = djs();
        return [today.startOf("month"), today.endOf("month")];
      },
    },
  ];

  const getButtonLabel = () => {
    if (dateRangeValue && dateRangeValue[0] && dateRangeValue[1]) {
      const startDate = dateRangeValue[0].format("DD/MM/YYYY");
      const endDate = dateRangeValue[1].format("DD/MM/YYYY");

      const isShortcut =
        shortcutsItems.find(
          (shortcut) =>
            djs(
              shortcut.getValue({
                isValid: function (): boolean {
                  throw new Error("Function not implemented.");
                },
              })[0]
            ).isSame(dateRangeValue[0], "day") &&
            djs(
              shortcut.getValue({
                isValid: function (): boolean {
                  throw new Error("Function not implemented.");
                },
              })[1]
            ).isSame(dateRangeValue[1], "day")
        )?.label ?? null;

      return isShortcut || `${startDate} - ${endDate}`;
    }
  };

  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleDateRangeChange = (value: [Dayjs | null, Dayjs | null]) => {
    setDateRangeValue(value);

    if (value[0] && value[1] && onChange) {
      onChange([
        value[0]?.format("YYYY-MM-DD") || "",
        value[1]?.format("YYYY-MM-DD") || "",
      ]);
    }
  };

  return (
    <>
      <TableButton
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="filterButton"
        endIcon={<CalendarIcon width={18} height={18} />}
        sx={{
          height: "38px",
          border: "1px solid",
          borderColor: "divider",
          padding: "9px 12px",
        }}
      >
        <div className="hide-on-mobile">{getButtonLabel()}</div>
      </TableButton>
      <DateRangePicker
        value={dateRangeValue}
        onAccept={handleDateRangeChange}
        open={open}
        onClose={() => setOpen(false)}
        slots={{
          field: () => null,
          popper: undefined,
        }}
        slotProps={{
          popper: {
            anchorEl: buttonRef.current,
            placement: "bottom-start",
          },
          shortcuts: {
            items: shortcutsItems,
          },
          actionBar: { actions: [] },
        }}
        format="DD/MM/YYYY"
      />
    </>
  );
}
