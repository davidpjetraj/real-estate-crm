import React from "react";
import { Metadata } from "next";
import StreetPage from "./page-content";

export const metadata: Metadata = {
  title: "Streets",
};

export default function page() {
  return <StreetPage />;
}
