import CircularProgress from '@mui/material/CircularProgress';
import { alpha, styled } from '@mui/material';

const FormLoaderWrapper = styled('div')`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: ${({ theme }) => alpha(theme.palette.background.paper, 0.5)};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export function FormLoader({ style = {} }: { style?: any }) {
  return (
    <FormLoaderWrapper
      style={{
        ...style,
      }}>
      <CircularProgress />
    </FormLoaderWrapper>
  );
}
