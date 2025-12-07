import React from "react";
import { Metadata } from "next";
import DepartmentPage from "./page-content";

export const metadata: Metadata = {
  title: "Departments",
};

export default function page() {
  return <DepartmentPage />;
}

