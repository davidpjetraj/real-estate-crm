import React from "react";
import ClientPage from "./page-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients",
};

export default function page() {
  return <ClientPage />;
}
