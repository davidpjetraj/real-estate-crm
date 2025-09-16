import { Button, ButtonProps, CircularProgress, styled } from "@mui/material";

type Props = ButtonProps & {
  loading?: boolean | number;
};

const Wrapper = styled(Button)<Props>`
  position: relative;
  @media (max-width: 430px) {
    white-space: nowrap;
  }
  .loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .MuiButton-icon {
    opacity: ${({ loading }) => (loading ? 0 : 1)};
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: ${({ loading }) => (loading ? 0 : 1)};
  }
`;

export function LoadingButton({ children, loading = false, ...rest }: Props) {
  return (
    <Wrapper {...rest} loading={loading}>
      <div className="content">{children}</div>
      <div className="loader">
        {loading && <CircularProgress size={18} color="inherit" />}
      </div>
    </Wrapper>
  );
}
