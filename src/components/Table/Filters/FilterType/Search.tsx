import { styled, TextField } from "@mui/material";
import { useDebouncedCallback } from "use-debounce";
import { IDataStore } from "../../interfaces/DataStore";

const Wrapper = styled("div")`
  width: 100%;
  input {
    height: 42px;
    box-sizing: border-box;
  }
`;

export default function Search({ data, store }: any) {
  const { updateFilterItem } = store((state: IDataStore) => state);

  const debounced = useDebouncedCallback(updateFilterItem, 500);

  return (
    <Wrapper>
      <TextField
        placeholder={"Kërko..."}
        variant="outlined"
        size="small"
        defaultValue={data.value}
        onChange={(e) =>
          debounced({
            ...data,
            value: e.target.value,
          })
        }
        style={{
          width: "100%",
          height: 35,
        }}
      />
    </Wrapper>
  );
}
