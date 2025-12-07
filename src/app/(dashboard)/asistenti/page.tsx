import React from "react";
import { Metadata } from "next";
import AsistentiPage from "./page-content";

export const metadata: Metadata = {
  title: "Asistentet",
};

export default function page() {
  return <AsistentiPage />;
}

