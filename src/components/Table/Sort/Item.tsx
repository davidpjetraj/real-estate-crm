import {
  Autocomplete,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { memo } from "react";
import { useShallow } from "zustand/react/shallow";
import { IDataStore } from "../interfaces/DataStore";
import { DragIndicatorOutlined } from "@mui/icons-material";
import { CloseIcon } from "@/components/icons/Close";
import { sortOptions } from "@/components/shared/utils";

export const SortingAsc = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={"currentColor"}
    fill={"none"}
    {...props}
  >
    <path
      d="M3 9L14 9.00008"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 15H10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 3H19"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5 21V9M18.5 21C17.7998 21 16.4915 19.0057 16 18.5M18.5 21C19.2002 21 20.5085 19.0057 21 18.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SortingDesc = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={"currentColor"}
    fill={"none"}
    {...props}
  >
    <path
      d="M3 15L14 14.9999"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 9H10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 21H19"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5 3V15M18.5 3C17.7998 3 16.4915 4.9943 16 5.5M18.5 3C19.2002 3 20.5085 4.9943 21 5.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const Wrapper = styled("div")`
  display: flex;
  cursor: pointer;
  align-items: center;
  padding: 2px 8px;
  .label {
    min-width: calc(50% - 15px);
    font-size: 14px;
    color: ${({ theme }) => theme.palette.text.primary};
  }

  .drag {
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
  }

  input {
    user-select: none;
    cursor: pointer;
    ::selection {
      background: transparent;
    }
  }
  .MuiInputAdornment-root,
  .MuiFormControl-root,
  .MuiInputBase-root {
    cursor: pointer;
  }
`;

function Item({ data, store, attributes, listeners }: any) {
  const { removeSortItem, updateSortItem } = store(
    useShallow((state: IDataStore) => state)
  );

  return (
    <Wrapper>
      <div className="drag" {...attributes} {...listeners}>
        <DragIndicatorOutlined width={16} height={16} />
      </div>
      <div className="label">{data.label}</div>

      <Autocomplete
        value={sortOptions.find((option) => option.value === data?.value)}
        onChange={(e, selected) => {
          updateSortItem({
            ...data,
            value: selected.value,
          });
        }}
        openOnFocus
        options={sortOptions}
        getOptionLabel={(option: any) => option.label}
        style={{ width: "100%", cursor: "pointer" }}
        disableClearable
        renderInput={({ inputProps, InputProps, ...rest }) => (
          <TextField
            {...rest}
            placeholder="Zgjidhni"
            variant="outlined"
            size="small"
            InputProps={{
              ...InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  {data?.value === "desc" ? (
                    <SortingAsc width={18} height={18} />
                  ) : (
                    <SortingDesc width={18} height={18} />
                  )}
                </InputAdornment>
              ),
            }}
            inputProps={{
              ...inputProps,
              readOnly: true,
            }}
          />
        )}
      />

      <IconButton
        style={{ marginLeft: 10 }}
        size="small"
        onClick={() => removeSortItem(data)}
      >
        <CloseIcon width={16} height={16} />
      </IconButton>
    </Wrapper>
  );
}
export default memo(Item);
