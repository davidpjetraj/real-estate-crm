"use client";
import { Grid, styled } from "@mui/material";
import React from "react";

interface Props {
  title: string;
  description?: string;
  children: React.ReactNode;
  multipleChildren?: boolean;
  style?: React.CSSProperties;
  column?: boolean;
}

const CardWrapper = styled("div")`
  padding: 14px 0px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};

  h3 {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.palette.text.primary};
    margin-top: 0;
    margin-bottom: 2px;
    line-height: 1.2em;
  }
  p {
    font-size: 14px;
    color: ${({ theme }) => theme.palette.text.secondary};
    margin: 0;
  }
  line-height: 1.2em;
  .card-content {
    &.multiple-children {
      padding: 24px;
      border: 1px solid ${({ theme }) => theme.palette.divider};
      border-radius: ${({ theme }) => theme.shape.borderRadius}px;
    }
  }
`;

export default function Card({
  title,
  description,
  children,
  multipleChildren,
  style,
  column,
}: Props) {
  return (
    <CardWrapper style={style}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: column ? 12 : 4 }}>
          <div className="card-left">
            <h3>{title}</h3>
            {description && <p>{description}</p>}
          </div>
        </Grid>

        <Grid size={{ xs: 12, md: column ? 12 : 8 }}>
          <div
            className={`card-content ${
              multipleChildren ? "multiple-children" : ""
            }`}
          >
            <div className="div">{children}</div>
          </div>
        </Grid>
      </Grid>
    </CardWrapper>
  );
}
