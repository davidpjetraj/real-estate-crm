import Item from "./Item";
import { styled } from "@mui/material/styles";
import { useShallow } from "zustand/react/shallow";
import { memo } from "react";
import { IDataStore } from "../interfaces/DataStore";

const Wrapper = styled("div")`
  display: flex;
  flex-direction: column;
  width: 100%;

  p {
    margin-bottom: 5px;
    color: ${({ theme }) => theme.palette.text.secondary};
    font-size: 14px;
    margin-top: 0;
  }
  .items {
    display: flex;
    gap: 10px;
    flex-direction: column;
  }
`;

function Items({ store, columns }: { store: any; columns: any }) {
  const { filters } = store(useShallow((state: IDataStore) => state));

  if (filters.length === 0) return null;

  return (
    <Wrapper>
      <p>Të gjitha filterat</p>
      <div className="items">
        {filters?.map((item: any) => (
          <Item data={item} columns={columns} store={store} key={item.id} />
        ))}
      </div>
    </Wrapper>
  );
}
export default memo(Items);
