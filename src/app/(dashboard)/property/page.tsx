import React from "react";
import { Metadata } from "next";
import PropertyPage from "./page-content";

export const metadata: Metadata = {
  title: "Property",
};

export default function page() {
  return <PropertyPage />;
}
