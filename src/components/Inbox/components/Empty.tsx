import InboxDMIcon from "@/components/icons/InboxDM-icon";
import { styled } from "@mui/material";
import React from "react";

const Wrapper = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 450px;

  p {
    color: ${({ theme }) => theme.palette.text.secondary};
    font-size: 16px;
    font-weight: 400;
    text-align: center;
    margin-top: 15px;
  }
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    border-radius: 50px;
    background-color: ${({ theme }) => theme.palette.background.paper};
  }
`;

export default function Empty() {
  return (
    <Wrapper>
      <div className="icon">
        <InboxDMIcon />
      </div>
      <p>No messages</p>
    </Wrapper>
  );
}
