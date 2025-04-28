import * as React from "react";
import Right from "./components/Right";
import Left from "./components/Left";

export default async function RootLayout({}: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Left />
      <Right />
    </div>
  );
}
