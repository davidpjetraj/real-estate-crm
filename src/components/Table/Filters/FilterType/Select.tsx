import {
  Autocomplete,
  Checkbox,
  Chip,
  styled,
  TextField,
  useTheme,
} from '@mui/material';
import { TableColumn } from '../../components/Table';
import { IDataStore } from '../../interfaces/DataStore';

const Wrapper = styled('div')`
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
export default function Select({
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
          const { key, ...optionProps } = props;
          const color = option.color || theme.palette.grey[700];

          return (
            <li key={option.value || key} {...optionProps}>
              <Checkbox style={{ marginRight: 8 }} checked={selected} />
              <Chip
                size="small"
                label={option?.label}
                style={{
                  backgroundColor: color,
                  fontWeight: 600,
                  color: theme.palette.getContrastText(color),
                }}
              />
            </li>
          );
        }}
        limitTags={2}
        disableCloseOnSelect
        openOnFocus
        noOptionsText="Nuk ka të dhëna"
        options={data?.filterOptions?.options || []}
        getOptionLabel={(option: any) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        style={{ width: '100%', cursor: 'pointer' }}
        renderTags={(value, getTagProps) => {
          return value.map((option, index) => {
            const color = option.color || theme.palette.grey[700];
            return (
              <Chip
                size="small"
                {...getTagProps({ index })}
                label={option.label}
                key={option.value || index}
                style={{
                  backgroundColor: color,
                  fontWeight: 600,
                  color: theme.palette.getContrastText(color),
                }}
              />
            );
          });
        }}
        renderInput={({ inputProps, ...rest }) => (
          <TextField
            {...rest}
            placeholder="Zgjidhni"
            variant="outlined"
            size="small"
            inputProps={{
              ...inputProps,
              readOnly: true,
            }}
          />
        )}
      />
    </Wrapper>
  );
}
