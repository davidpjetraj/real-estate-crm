import { CloseIcon } from "@/components/icons/Close";
import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { memo } from "react";
import { useShallow } from "zustand/react/shallow";
import { IDataStore } from "../interfaces/DataStore";
import FilterType from "./FilterType";

const Wrapper = styled("div")`
  display: flex;
  cursor: pointer;
  align-items: center;
  padding: 8px 8px;
  border: 1px solid ${({ theme }) => theme.palette.divider};
  border-radius: 8px;
  min-height: 50px;

  .label {
    width: 100%;
    max-width: 120px;
    min-width: 120px;
    font-size: 14px;
    color: ${({ theme }) => theme.palette.text.primary};
    line-height: 42px;
    padding-left: 6px;
  }

  .input-wrapper {
    width: calc(100% - 120px - 40px);
    display: flex;
  }
  .action {
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

function Item({ data, store }: any) {
  const { removeFilterItem } = store(useShallow((state: IDataStore) => state));

  return (
    <Wrapper>
      <div className="label">{data.label}</div>
      <div className="input-wrapper">
        <FilterType data={data} store={store} />
      </div>
      <div className="action">
        <IconButton
          style={{ marginLeft: 10 }}
          size="small"
          onClick={() => removeFilterItem(data)}
        >
          <CloseIcon width={16} height={16} />
        </IconButton>
      </div>
    </Wrapper>
  );
}
export default memo(Item);
