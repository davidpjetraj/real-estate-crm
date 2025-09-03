import { DragIcon } from "@/components/icons/DragIcon";
import { Switch } from "@mui/material";
import { styled } from "@mui/material/styles";
import classNames from "classnames";
import { memo } from "react";
import { IDataStore } from "../interfaces/DataStore";

const Wrapper = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left {
    display: flex;
    align-items: center;
  }

  .drag {
    cursor: grab;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

function Item({ data, store, attributes, listeners }: any) {
  const { toggleColumnVisibility } = store((state: IDataStore) => state);
  return (
    <Wrapper
      className={classNames({
        disabled: data.disableHidable,
      })}
    >
      <div className="left" {...attributes} {...listeners}>
        <div className="drag">
          <DragIcon width={18} height={22} />
        </div>
        <div className="label">{data.label}</div>
      </div>
      <Switch
        disabled={data.disableHidable}
        checked={!data.hidden}
        onChange={() => toggleColumnVisibility(data.id)}
      />
    </Wrapper>
  );
}
export default memo(Item);
