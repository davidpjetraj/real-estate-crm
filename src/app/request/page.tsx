import React from "react";
import { Metadata } from "next";
import RequestPage from "./page-content";

export const metadata: Metadata = {
  title: "Requests",
};

export default function page() {
  return <RequestPage />;
}
