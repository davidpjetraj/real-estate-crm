import { useState, useEffect } from "react";
import { CircularProgress, styled } from "@mui/material";
import Logo from "@/app/logo";

const Wrapper = styled("div")`
  display: flex;
  position: absolute;
  inset: 0;
  z-index: 9998;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.palette.background.default};
  flex-direction: column;
  gap: 30px;
  padding-bottom: 60px;

  .loader {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

// ----------------------------------------------------------------------

export function SplashScreen({ ...other }: any) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <Wrapper>
      <div className="loader">
        <CircularProgress
          thickness={4}
          size={44}
          sx={{ color: "primary.main" }}
          {...other}
        />
      </div>

      <div className="footer">
        <Logo width={140} height={20} />
      </div>
    </Wrapper>
  );
}
