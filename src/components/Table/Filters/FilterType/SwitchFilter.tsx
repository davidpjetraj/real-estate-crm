import { styled, Switch } from '@mui/material';
import { TableColumn } from '../../components/Table';
import { IDataStore } from '../../interfaces/DataStore';

const Wrapper = styled('div')`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  width: 100%;
`;

export function SwitchFilter({
  data,
  store,
}: {
  store: any;
  data: TableColumn<any>;
}) {
  const { updateFilterItem } = store((state: IDataStore) => state);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;

    const booleanFilter = {
      ...data,
      value: newValue,
    };

    updateFilterItem(booleanFilter);
  };

  return (
    <Wrapper>
      <Switch
        checked={data.value}
        onChange={handleSwitchChange}
        color="primary"
      />
    </Wrapper>
  );
}
