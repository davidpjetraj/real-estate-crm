import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';

const Wrapper = styled('div')`
  height: 44px;
  display: flex;
  align-items: center;
  padding-left: 8px;
  gap: 30px;
`;

export default function LoadingItem() {
  return (
    <Wrapper>
      <Skeleton variant="text" width={60} height={30} />
      <Skeleton variant="text" width={280} height={30} />
      <Skeleton variant="text" width={180} height={30} />
    </Wrapper>
  );
}
