import {
  Autocomplete,
  Avatar,
  Checkbox,
  Chip,
  styled,
  TextField,
  useTheme,
} from "@mui/material";
import { TableColumn } from "../../components/Table";
import { IDataStore } from "../../interfaces/DataStore";
import { getUri } from "../../utils";

const Wrapper = styled("div")`
  width: 100%;

  .MuiAutocomplete-endAdornment {
    top: 9px;
    transform: translateY(0);
  }
  input {
    height: 30px;
    box-sizing: border-box;
  }
`;

export default function User({
  data,
  store,
}: {
  data: TableColumn<any>;
  store: any;
}) {
  const { updateFilterItem } = store((state: IDataStore) => state);
  const theme = useTheme();

  return (
    <Wrapper>
      <Autocomplete
        value={data.value || []}
        multiple={true}
        onChange={(e, newValue) => {
          updateFilterItem({
            ...data,
            value: newValue,
          });
        }}
        renderOption={(props, option, { selected }) => {
          const color = option.color || theme.palette.grey[700];
          return (
            <li {...props}>
              <Checkbox style={{ marginRight: 8 }} checked={selected} />
              <Chip
                size="small"
                label={option.label}
                avatar={
                  <Avatar
                    src={getUri(option?.avatar || "")}
                    alt={option?.label}
                    sx={{
                      width: 18,
                      height: 18,
                      margin: "0 8px",
                      bgcolor: color,
                      color: "#fff",
                    }}
                  >
                    {option?.label[0]}
                  </Avatar>
                }
                style={{
                  fontWeight: 600,
                }}
              />
            </li>
          );
        }}
        limitTags={2}
        disableCloseOnSelect
        openOnFocus
        noOptionsText="Nuk ka të dhëna"
        options={[]}
        getOptionLabel={(option: any) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        style={{ width: "100%", cursor: "pointer" }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const color = option.color || theme.palette.grey[700];
            return (
              <Chip
                avatar={
                  <Avatar
                    alt={option.label}
                    src={getUri(option?.avatar || "")}
                    sx={{
                      width: 18,
                      height: 18,
                      margin: "0 8px",
                      bgcolor: color,
                      color: "#fff",
                    }}
                  >
                    {option?.label[0]}
                  </Avatar>
                }
                {...getTagProps({ index })}
                label={option.label}
                key={`${option.label}-${option.value}`}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Zgjidhni"
            variant="outlined"
            size="small"
            inputProps={{
              ...params.inputProps,
              startadornment: (
                <>
                  {data?.value?.avatar ? (
                    <Avatar
                      alt={data.value.label}
                      src={getUri(data?.value.avatar)}
                      sx={{
                        width: 22,
                        height: 22,
                        marginRight: "6px",
                        bgcolor: data?.value?.color || theme.palette.grey[700],
                        color: "#fff",
                      }}
                    >
                      {data?.label[0]}
                    </Avatar>
                  ) : null}
                  {params.InputProps.startAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </Wrapper>
  );
}
