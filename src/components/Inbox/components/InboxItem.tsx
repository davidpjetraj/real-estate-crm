"use client";
import { alpha, IconButton, styled, Tooltip } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import Description from "./Description";
import {
  NotificationModel,
  NotificationType,
} from "@/lib/graphql/generated/graphql";
import useParams from "@/hooks/useParams";
import { useInbox } from "../../../../store/useInbox";
import MemberAvatar from "@/components/shared/Avatar";
import InboxInIcon from "@/components/icons/InboxInIcon";
import InboxOutIcon from "@/components/icons/InboxOutIcon";

const Wrapper = styled("div")`
  padding: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  display: flex;
  position: relative;
  width: 100%;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  @media (max-width: 768px) {
    justify-content: space-between;
  }

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.palette.action.hover};

    .archive-btn {
      opacity: 1;
    }
  }
  .archive-btn {
    opacity: 0;
    transition: 0.3s ease-in-out;
    @media (max-width: 768px) {
      opacity: 1;
    }
  }
  .left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .author {
      display: flex;
      align-items: center;
      gap: 10px;
      background-color: ${({ theme }) =>
        alpha(theme.palette.text.primary, 0.05)};
      width: auto;
      border-radius: 50px;
      padding: 3px;
      padding-right: 8px;

      .name {
        font-size: 13px;
      }
    }

    .info {
      display: flex;
      align-items: flex-start;
      width: 100%;
      padding-top: 8px;

      .description {
        font-size: 14px;
        font-weight: 400;
        color: ${({ theme }) => theme.palette.text.secondary};
      }
    }
  }

  .top {
    display: flex;
    align-items: center;
    gap: 10px;
    .new {
      background-color: ${({ theme }) => theme.palette.primary.main};
      border-radius: 10px;
      width: 6px;
      height: 6px;
    }
  }

  .actions {
    width: 150px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    margin-left: auto;

    .date {
      color: ${({ theme }) => theme.palette.text.secondary};
      text-align: right;
      font-size: 12px;
    }
  }
`;

const getNotificationParams = (data: NotificationModel) => {
  switch (data.type) {
    case NotificationType.CommentsOnProperties:
    case NotificationType.CommentsOnRequests:
    case NotificationType.PropertyAssignedToClient:
    case NotificationType.AtachmentAdded:
    case NotificationType.PropertyAssignedToUser:
    case NotificationType.PropertyStatusUpdated:
    case NotificationType.MentionedInComment:
    case NotificationType.RequestAssignedToClient:
    case NotificationType.RequestAssignedToUser:
    case NotificationType.RequestStatusUpdated:
    case NotificationType.StatusUpdates:
    case NotificationType.PropertyRemoved:
    case NotificationType.PropertyRestored:
    case NotificationType.RequestRemoved:
    case NotificationType.ClientRemoved:
    case NotificationType.ClientRestored:
    case NotificationType.NewClient:
      return {
        type: "properties",
        tab: "details",
        id: data?.id,
      };
    default:
      return null;
  }
};

export default function InboxItem({
  data,
  inArchive,
}: {
  data: NotificationModel;
  inArchive?: boolean;
}) {
  const { setParams } = useParams();
  const { archiveItem, unarchiveItem } = useInbox(useShallow((state) => state));

  const isValid = useMemo(() => {
    return !!getNotificationParams(data);
  }, [data]);

  const tooltipText = useMemo(() => {
    return isValid
      ? "Click here to view details"
      : "The notification was deleted";
  }, [isValid]);

  const handleClick = useCallback(() => {
    const params = getNotificationParams(data);
    if (params) setParams(params as any);
  }, [isValid, data, setParams]);

  return (
    <Tooltip title={tooltipText} arrow enterDelay={500}>
      <Wrapper
        onClick={handleClick}
        className="inbox-item-wrapper"
        sx={{
          cursor: isValid ? "pointer" : "not-allowed",
          opacity: isValid ? 1 : 0.5,
        }}
      >
        <div className="left">
          <div className="top">
            <div className="author">
              <MemberAvatar user={data?.author as any} size={22} />
            </div>

            {data.seen ? null : <div className="new" />}
          </div>
          <div className="info">
            <div className="description">
              <Description data={data} />
            </div>
          </div>
        </div>
        <div className="actions">
          <div className="date">{data.created_at}</div>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              if (inArchive) {
                unarchiveItem(data.id);
              } else {
                archiveItem(data.id);
              }
            }}
            className="archive-btn"
          >
            {inArchive ? <InboxInIcon /> : <InboxOutIcon />}
          </IconButton>
        </div>
      </Wrapper>
    </Tooltip>
  );
}
