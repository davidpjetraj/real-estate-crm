import { styled, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { TableColumn } from '../../components/Table';
import { IDataStore } from '../../interfaces/DataStore';

const Wrapper = styled('div')`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  input {
    height: 42px !important;
    box-sizing: border-box;
  }

  .divider {
    color: ${({ theme }) => theme.palette.text.secondary};
  }
`;

export default function NumberRange({
  data,
  store,
}: {
  data: TableColumn<any>;
  store: any;
}) {
  const { updateFilterItem } = store((state: IDataStore) => state);

  const [minValue, setMinValue] = useState<number | string>(
    data?.value?.[0] || '',
  );
  const [maxValue, setMaxValue] = useState<number | string>(
    data?.value?.[1] || '',
  );

  const [debouncedMinValue] = useDebounce(minValue, 500);
  const [debouncedMaxValue] = useDebounce(maxValue, 500);

  useEffect(() => {
    // if (debouncedMinValue !== '' && debouncedMaxValue !== '') {
    updateFilterItem({
      ...data,
      value: [debouncedMinValue.toString(), debouncedMaxValue.toString()],
    });
    // }
  }, [debouncedMinValue, debouncedMaxValue, data, updateFilterItem]);

  return (
    <Wrapper>
      <TextField
        placeholder="Min"
        size="small"
        variant="outlined"
        value={minValue !== '' ? minValue : ''}
        type="number"
        onChange={e => {
          setMinValue(e.target.value ? Number(e.target.value) : '');
        }}
      />
      <div className="divider">–</div>
      <TextField
        placeholder="Max"
        size="small"
        variant="outlined"
        value={maxValue !== '' ? maxValue : ''}
        type="number"
        onChange={e => {
          setMaxValue(e.target.value ? Number(e.target.value) : '');
        }}
      />
    </Wrapper>
  );
}
