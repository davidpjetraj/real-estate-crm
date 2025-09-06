"use client";
import { styled } from "@mui/material";
import { djs } from "../shared/utils";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "@/lib/graphql/user";

const Wrapper = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  padding: 40px 0px 20px 0px;
  text-align: center;

  p {
    margin: 0;
    padding: 0;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: ${({ theme }) => theme.palette.text.secondary};
  }
  h1 {
    margin: 0;
    padding: 0;
    font-weight: 600;
    font-size: 32px;
    line-height: 39px;
    color: ${({ theme }) => theme.palette.text.primary};

    @media (max-width: 550px) {
      font-size: 28px;
      line-height: 34px;
    }
  }
`;

export default function DashboardInfo() {
  const { data } = useQuery(GET_CURRENT_USER);
  const user = data?.account;

  function generateGreetings() {
    const currentHour = parseInt(djs().format("HH"), 10);

    if (currentHour >= 3 && currentHour < 12) {
      return `Good morning, ${user?.first_name || "User"}`;
    } else if (currentHour >= 12 && currentHour < 15) {
      return `Good afternoon, ${user?.first_name || "User"}`;
    } else if (currentHour >= 15 && currentHour < 20) {
      return `Good evening, ${user?.first_name || "User"}`;
    } else if (currentHour >= 20 || currentHour < 3) {
      return `Good evening, ${user?.first_name || "User"}`;
    } else {
      return `Hello, ${user?.first_name || "User"}`;
    }
  }

  return (
    <Wrapper>
      <p>{djs().format("dddd, D. MMMM")}</p>
      <h1>{generateGreetings()}</h1>
    </Wrapper>
  );
}
