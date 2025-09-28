"use client";

import { styled, useMediaQuery, useTheme } from "@mui/material";
import { useEffect } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import ActivityItem from "./Item";
import {
  ActivitiesDocument,
  ActivitiesQuery,
  ActivitiesQueryVariables,
  ActivityCreatedFor,
  ActivityModel,
  useActivityCreatedSubscription,
  useActivityRemovedSubscription,
  useActivityUpdatedSubscription,
} from "@/lib/graphql/generated/graphql";

const ActivitiesWrapper = styled("div")`
  padding: 10px 16px;
  position: relative;
`;

export default function Activity({
  id,
  data,
  loading,
  created_for,
  activitiesEndRef,
}: {
  id: string;
  data: ActivitiesQuery | undefined;
  loading?: boolean;
  created_for: ActivityCreatedFor;
  activitiesEndRef?: any;
}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  useActivityCreatedSubscription({
    variables: {
      input: {
        id: id,
        created_for: created_for,
      },
    },
    skip: !id,
    onData: ({ client, data }) => {
      if (data.data?.activityCreated) {
        const existing = client.cache.readQuery<
          ActivitiesQuery,
          ActivitiesQueryVariables
        >({
          query: ActivitiesDocument,
          variables: {
            input: {
              id: id as string,
              created_for: created_for,
            },
          },
        });

        client.cache.writeQuery({
          query: ActivitiesDocument,
          variables: {
            input: {
              id: id as string,
              created_for: created_for,
            },
          },
          data: {
            activities: [
              ...(existing?.activities || []),
              data.data.activityCreated,
            ],
          },
        });
      }
    },
    onError(error) {
      console.log(error, "error on creating activity");
    },
  });

  useActivityUpdatedSubscription({
    variables: {
      input: {
        id: id as string,
        created_for: created_for,
      },
    },
    skip: !id,
    onData: ({ client, data }) => {
      if (data.data?.activityUpdated) {
        const existing = client.cache.readQuery<
          ActivitiesQuery,
          ActivitiesQueryVariables
        >({
          query: ActivitiesDocument,
          variables: {
            input: {
              id: id as string,
              created_for: created_for,
            },
          },
        });

        client.cache.writeQuery({
          query: ActivitiesDocument,
          variables: {
            input: {
              id: id as string,
              created_for: created_for,
            },
          },
          data: {
            activities: [
              ...(existing?.activities || []).map((activity) =>
                activity.id === data?.data?.activityUpdated?.id
                  ? data?.data?.activityUpdated
                  : activity
              ),
            ],
          },
        });
      }
    },
    onError: (error) => {
      console.log("error on updating comment", error);
    },
  });

  useActivityRemovedSubscription({
    variables: {
      input: {
        id: id as string,
        created_for: created_for,
      },
    },
    skip: !id,
    onData: ({ client, data }) => {
      if (data.data?.activityRemoved) {
        const existing = client.cache.readQuery<
          ActivitiesQuery,
          ActivitiesQueryVariables
        >({
          query: ActivitiesDocument,
          variables: {
            input: {
              id: id as string,
              created_for: created_for,
            },
          },
        });

        client.cache.writeQuery({
          query: ActivitiesDocument,
          variables: {
            input: {
              id: id as string,
              created_for: created_for,
            },
          },
          data: {
            activities: [
              ...(existing?.activities || []).filter(
                (activity) => activity?.id !== data?.data?.activityRemoved?.id
              ),
            ],
          },
        });
      }
    },
  });

  useEffect(() => {
    if (!loading) {
      activitiesEndRef?.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [loading]);

  if (loading) {
    return null;
  }

  return (
    <div style={{ position: "relative" }}>
      <Scrollbars
        style={{
          height: !isSmallScreen
            ? "calc(100vh - 257px)"
            : "calc(100vh - 247px)",
          width: "100%",
        }}
      >
        <ActivitiesWrapper>
          {data?.activities?.map((activity, index) => {
            return (
              <ActivityItem
                activity={activity as ActivityModel}
                key={activity?.id}
                created_for_id={id}
                index={index}
              />
            );
          })}
        </ActivitiesWrapper>
      </Scrollbars>
    </div>
  );
}
