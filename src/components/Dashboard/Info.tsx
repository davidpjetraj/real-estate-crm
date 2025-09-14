"use client";
import { styled } from "@mui/material";
import { djs } from "../shared/utils";
import { useAccountQuery } from "../../lib/graphql/generated/graphql";
import { useState, useEffect } from "react";
import { useUserData } from "../../hooks/use-user-data";
import { Button, TextField, Box } from "@mui/material";

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
  // Use the user store for managing user data
  const { userData, loading: userLoading, updateUserData } = useUserData();

  // Check if we have a token before making the query
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setHasToken(!!token);
  }, []);

  const { data, loading, error } = useAccountQuery({
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
    skip: !hasToken, // Skip the query if no token
  });

  const user = data?.account;

  // Handle expired token only (not permission issues)
  useEffect(() => {
    if (
      error &&
      error.message.includes("Unauthorized") &&
      !error.message.includes("autorizimin")
    ) {
      console.log("Token expired, redirecting to login...");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
  }, [error]);

  // Debug logging (remove in production)
  // console.log("Has token:", hasToken);
  // console.log("Account query result:", { data, loading, error });
  // console.log("User data:", user);
  // console.log("User store data:", userData);
  // console.log("User loading:", userLoading);

  // If no user data is stored, show a button to add it
  const [showAddNameButton, setShowAddNameButton] = useState(false);
  const [tempName, setTempName] = useState("");

  useEffect(() => {
    if (!userData?.first_name && !userLoading) {
      setShowAddNameButton(true);
    }
  }, [userData, userLoading]);

  const handleAddName = () => {
    if (tempName.trim()) {
      updateUserData({
        first_name: tempName.trim(),
        name: tempName.trim(),
      });
      setShowAddNameButton(false);
      setTempName("");
    }
  };

  function generateGreetings() {
    const currentHour = parseInt(djs().format("HH"), 10);

    // Use user data from query if available, otherwise fallback to user store
    const firstName = user?.first_name || userData?.first_name || "User";

    // console.log("Greeting debug:", {
    //   user_first_name: user?.first_name,
    //   userData_first_name: userData?.first_name,
    //   firstName,
    //   currentHour,
    // });

    if (currentHour >= 3 && currentHour < 12) {
      return `Good morning, ${firstName}`;
    } else if (currentHour >= 12 && currentHour < 15) {
      return `Good afternoon, ${firstName}`;
    } else if (currentHour >= 15 && currentHour < 20) {
      return `Good evening, ${firstName}`;
    } else if (currentHour >= 20 || currentHour < 3) {
      return `Good evening, ${firstName}`;
    } else {
      return `Hello, ${firstName}`;
    }
  }

  if (loading && !userData) {
    return (
      <Wrapper>
        <p>{djs().format("dddd, D. MMMM")}</p>
        <h1>Loading...</h1>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <p>{djs().format("dddd, D. MMMM")}</p>
      <h1>{generateGreetings()}</h1>

      {showAddNameButton && (
        <Box sx={{ mt: 2, display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Enter your name"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddName()}
          />
          <Button
            variant="contained"
            size="small"
            onClick={handleAddName}
            disabled={!tempName.trim()}
          >
            Add Name
          </Button>
        </Box>
      )}
    </Wrapper>
  );
}
