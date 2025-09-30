"use client";
import * as React from "react";
import EmptyWidget from "./EmptyWidget";
import Card from "./Card";
import SkeletonLoader from "./SkeletonLoader";
import { usePropertiesByCityWidgetQuery } from "@/lib/graphql/generated/graphql";
import { BarChart } from "@mui/x-charts";

function RegisteredCompanies() {
  const { data, loading } = usePropertiesByCityWidgetQuery({
    variables: {},
    fetchPolicy: "no-cache",
  });

  // Filter out items with null/undefined count or city name
  const validItems =
    data?.propertiesByCityWidget?.items?.filter(
      (item) =>
        item?.count !== null &&
        item?.count !== undefined &&
        item?.city?.name !== null &&
        item?.city?.name !== undefined
    ) || [];

  const isEmptyData = !validItems.length;

  return (
    <Card
      title={!isEmptyData ? "Cities with the most properties" : undefined}
      style={{ height: 320 }}
    >
      {loading ? (
        <SkeletonLoader />
      ) : !isEmptyData ? (
        <>
          <div>
            <BarChart
              series={[
                {
                  data: validItems.map((item) => item.count || 0),
                  color: "#125D56",
                },
              ]}
              height={270}
              xAxis={[
                {
                  data: validItems.map((item) => item.city?.name || ""),
                  scaleType: "band",
                },
              ]}
              sx={{
                width: "95%",
              }}
              borderRadius={2}
            />
          </div>
        </>
      ) : (
        <EmptyWidget />
      )}
    </Card>
  );
}

export default RegisteredCompanies;
