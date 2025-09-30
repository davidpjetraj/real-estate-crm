"use client";
import { styled } from "@mui/material";
import Card from "./Card";
import SkeletonLoader from "./SkeletonLoader";
import EmptyWidget from "./EmptyWidget";
import { LineChart } from "@mui/x-charts";
import { useMemo } from "react";
import { usePropertiesStatusWidgetQuery } from "@/lib/graphql/generated/graphql";

export const LegendWrapper = styled("div")`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  flex-wrap: wrap;
  height: 266px;
  margin-top: 20px;
  gap: 6px;
  width: 45%;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 12px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) =>
      theme.palette.mode === "light" ? "#cacaca" : "#212121"};
    border-radius: 16px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #aeaeae;
  }

  .item {
    display: flex;
    align-items: baseline;
    gap: 5px;
    width: 130px;

    .color {
      min-width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .label {
      font-size: 14px;
      font-weight: 500;
      ${({ theme }) => theme.breakpoints.down("sm")} {
        font-size: 12px;
      }
    }
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    width: 49%;
  }
`;

function PublishedJobsWidget() {
  const { data, loading } = usePropertiesStatusWidgetQuery({
    variables: {},
    fetchPolicy: "no-cache",
  });

  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const chartData = useMemo(() => {
    const statusData = data?.propertiesStatusWidget?.items?.map(
      (item) => item.count
    );
    const statusLabels = data?.propertiesStatusWidget?.items?.map((item) =>
      capitalizeFirstLetter(item.status)
    );

    return { statusData, statusLabels };
  }, [data]);

  const hasData = useMemo(() => {
    return (data?.propertiesStatusWidget?.items?.length ?? 0) > 0;
  }, [data]);

  return (
    <Card
      title={hasData ? "Properties status" : undefined}
      style={{ height: 320 }}
    >
      {loading ? (
        <SkeletonLoader />
      ) : hasData ? (
        <div>
          <LineChart
            height={270}
            series={[
              {
                data: chartData.statusData,
                area: false,
                showMark: false,
                color: "#6D3AFF",
              },
            ]}
            xAxis={[
              {
                scaleType: "band",
                data: chartData.statusLabels,
              },
            ]}
          />
        </div>
      ) : (
        <EmptyWidget />
      )}
    </Card>
  );
}

export default PublishedJobsWidget;
