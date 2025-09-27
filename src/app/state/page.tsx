import React from "react";
import { Metadata } from "next";
import StatePage from "./page-content";

export const metadata: Metadata = {
  title: "States",
};

export default function page() {
  return <StatePage />;
}
