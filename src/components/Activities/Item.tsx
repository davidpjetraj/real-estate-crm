"use client";
import { alpha, styled, Tooltip } from "@mui/material";
import classNames from "classnames";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import CommentActions from "./CommentActions";
import EditComment from "./EditComment";
import UpdatedKey from "./UpdatedKey";
import useAuth from "../../../store/useAuth";
import {
  AccountModel,
  ActivityModel,
  ActivityType,
} from "@/lib/graphql/generated/graphql";
import MemberAvatar from "../shared/Avatar";
import Logo from "@/app/logo";
import EditorContent from "../SocketFields/EditorContent";
import dayjs from "dayjs";

const Wrapper = styled("div")`
  display: flex;
  align-items: flex-start;
  gap: 12px;

  &.with-avatar {
    margin-bottom: 12px;

    .head {
      .left {
        line-height: 28px;
      }
    }
  }

  .tiptap-content {
    * {
      color: ${({ theme }) => theme.palette.text.primary} !important;
    }
    .mention {
      display: inline-block;
      vertical-align: middle;
    }
    .mention-content {
      background-color: ${({ theme }) =>
        alpha(theme.palette.primary.main, 0.1)};
      border-radius: 8px;
      padding: 4px;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      img {
        border-radius: 50%;
        margin-right: 4px;
        width: 18px;
        height: 18px;
        object-fit: cover;
      }

      .mention-label {
        line-height: 16px;
        font-size: 14px;
      }
      .mention-avatar {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        margin-right: 4px;
        display: inline-block;
        text-align: center;
        vertical-align: middle;
        line-height: 16px;
        font-size: 12px;
        color: #fff !important;
        text-transform: uppercase;
        background-color: ${({ theme }) => theme.palette.primary.main};
      }
    }
  }
  .activity-left {
    width: 35px;
  }

  .activity-right {
    display: block;
    width: calc(100% - 35px);
    overflow: hidden;
    .head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      .left {
        margin-top: 0;
        margin-bottom: 4px;
        font-size: 16px;
        font-weight: 500;

        .name {
          font-weight: 800;
          color: ${({ theme }) => theme.palette.text.primary};
          margin-right: 4px;
        }
        span {
          font-size: 14px;
          color: ${({ theme }) => theme.palette.text.secondary};
          font-weight: 400;
          cursor: pointer;
        }
      }
    }
  }

  p,
  a {
    margin: 0;
    font-size: 14px;
    color: ${({ theme }) => theme.palette.text.secondary};
  }
`;
export default function ActivityItem({
  activity,
  created_for_id,
  index,
}: {
  activity: ActivityModel;
  created_for_id: string;
  index: number;
}) {
  const { user } = useAuth(useShallow((state) => state));
  const [editing, setEditing] = useState<boolean>(false);

  const isMyComment = (activity: ActivityModel) => {
    return (
      activity?.type === ActivityType.Comment &&
      activity?.author?.id === user?.id
    );
  };

  const showAvatar = () => {
    switch (activity.type) {
      case ActivityType.Comment:
        return true;
      case ActivityType.Create:
        return true;

      case ActivityType.Delete:
        return true;
      case ActivityType.Update:
        return true;

      default:
        return false;
    }
  };

  const withAvatar = index === 0 || showAvatar();

  const is_bot = activity.is_bot;

  return (
    <Wrapper
      className={classNames({
        "with-avatar": withAvatar,
      })}
    >
      <div className="activity-left">
        {!is_bot && withAvatar && (
          <MemberAvatar user={activity?.author as AccountModel} size={28} />
        )}
        {is_bot && withAvatar && <Logo width={34} height={34} />}
      </div>
      <div className="activity-right">
        <div className="head">
          <div className={`left `}>
            {is_bot ? (
              <span className="name">KI-Assistent</span>
            ) : (
              <span className="name">{activity?.author?.name}</span>
            )}
            <UpdatedKey data={activity as ActivityModel} />
            <Tooltip
              arrow
              placement="top"
              title={dayjs(activity?.created_at).format("DD.MM.YYYY HH:mm")}
            >
              <span className="time">
                {" ·  "}
                {dayjs(activity?.created_at).format("DD.MM.YYYY HH:mm")}
              </span>
            </Tooltip>
            {activity?.edited && (
              <span style={{ marginLeft: 5 }}>(aktualisiert)</span>
            )}
          </div>
          {isMyComment(activity) && (
            <CommentActions data={activity} setEditing={setEditing} />
          )}
        </div>
        {activity?.type === ActivityType.Comment && (
          <>
            {!editing ? (
              <EditorContent jsonContent={activity?.message || {}} />
            ) : (
              <EditComment
                activity={activity}
                setEditing={setEditing}
                created_for_id={created_for_id}
              />
            )}
          </>
        )}
      </div>
    </Wrapper>
  );
}
