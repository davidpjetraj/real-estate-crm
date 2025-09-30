"use client";
import { styled } from "@mui/material";
import PieChartIcon from "@/components/icons/PieChartIcon";
import StyledIcon from "@/components/shared/StyledIcon";

const Wrapper = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  height: 270px;

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;

    h4 {
      color: ${({ theme }) => theme.palette.text.primary};
      font-size: 16px;
      margin: 0;
      text-align: center;
    }
    p {
      color: ${({ theme }) => theme.palette.text.secondary};
      font-size: 14px;
      margin: 0;
      text-align: center;
    }
  }
`;

const EmptyWidget = () => {
  return (
    <Wrapper>
      <StyledIcon>
        <PieChartIcon />
      </StyledIcon>
      <div>
        <h4>Nuk ka të dhëna</h4>
        <p>Nuk ka të dhëna për të shfaqur në këtë widget.</p>
      </div>
    </Wrapper>
  );
};

export default EmptyWidget;
