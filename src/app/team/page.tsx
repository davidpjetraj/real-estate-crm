import React from "react";
import TeamPage from "./page-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team",
};

export default function page() {
  return <TeamPage />;
}
