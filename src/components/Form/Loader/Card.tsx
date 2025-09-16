import CircularProgress from '@mui/material/CircularProgress';
import { alpha, styled } from '@mui/material';

const CardLoaderWrapper = styled('div')`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: ${({ theme }) => alpha(theme.palette.background.paper, 1)};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export function CardLoader({
  style = {},
  loaderStyles = {},
}: {
  style?: any;
  loaderStyles?: any;
}) {
  return (
    <CardLoaderWrapper
      style={{
        ...style,
      }}>
      <CircularProgress style={loaderStyles} />
    </CardLoaderWrapper>
  );
}
