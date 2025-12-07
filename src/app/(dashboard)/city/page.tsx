import React from "react";
import { Metadata } from "next";
import CityPage from "./page-content";

export const metadata: Metadata = {
  title: "Cities",
};

export default function page() {
  return <CityPage />;
}
