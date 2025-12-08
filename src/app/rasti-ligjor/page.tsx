import React from "react";
import { Metadata } from "next";
import RastiLigjorPage from "./page-content";

export const metadata: Metadata = {
  title: "Rastet Ligjore",
};

export default function page() {
  return <RastiLigjorPage />;
}
