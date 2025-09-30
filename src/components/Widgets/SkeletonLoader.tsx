import { alpha, Skeleton, styled } from "@mui/material";

const Wrapper = styled("div")`
  padding: 16px;
`;

const RowWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
`;

const FadedSkeleton = styled(Skeleton)`
  position: relative;
  border-radius: 4px;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(
      to right,
      ${({ theme }) => theme.palette.divider} 20%,
      ${({ theme }) => alpha(theme.palette.divider, 0.1)} 70%,
      ${({ theme }) => alpha(theme.palette.divider, 0)} 100%
    );
  }
`;

export default function SkeletonLoader() {
  return (
    <Wrapper style={{ height: 370 }}>
      <FadedSkeleton
        sx={{ width: "30%", height: "30px" }}
        animation="wave"
        variant="rectangular"
      />
      <RowWrapper>
        <FadedSkeleton
          sx={{ width: "90%", height: "12px" }}
          animation="wave"
          variant="rounded"
        />
        <FadedSkeleton
          sx={{ width: "60%", height: "12px", marginLeft: "5%" }}
          animation="wave"
          variant="rounded"
        />
      </RowWrapper>
    </Wrapper>
  );
}
