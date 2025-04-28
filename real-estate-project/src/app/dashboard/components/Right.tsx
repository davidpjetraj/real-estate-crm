"use client";
import { styled } from "@mui/material";
import React from "react";

const Wrapper = styled("div")`
  flex: 2;
  width: 50%;
  background-size: cover;
  min-height: 100vh;
  overflow: hidden;

  @media screen and ((min-width: 550px) and (max-width:960px)) {
    flex: 1;
    background-position: center;
  }

  @media (max-width: 960px) {
    width: 100%;
  }

  @media (max-width: 550px) {
    flex: 0;
  }
`;

// const images = [
//   "/images/auth/1.jpg",
//   "/images/auth/2.jpg",
//   "/images/auth/3.jpg",
//   "/images/auth/4.jpg",
// ];

// function randomIntFromInterval(min: any, max: any) {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }

export default function Right() {
  return (
    <Wrapper
      style={{
        // backgroundImage: `url(${images[randomIntFromInterval(0, 3)]})`,
        backgroundImage: `url('/image.png')`,
      }}
    />
  );
}
