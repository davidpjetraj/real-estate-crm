import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { Badge, IconButton, styled } from "@mui/material";
import classNames from "classnames";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import ArchiveContent from "./Archive";
import InboxContent from "./Inbox";
import useAuth from "../../../store/useAuth";
import { useInbox } from "../../../store/useInbox";
import { useUnreadNotificationsSubscription } from "@/lib/graphql/generated/graphql";
import { NotificationIcon } from "../icons/NotificationIcon";
import useLockBody from "@/hooks/useLockBody";

const Wrapper = styled("div")`
  position: relative;
  z-index: 999;

  .inbox-icon {
    width: 26px;
    height: 26px;
    padding: 0;
    border-radius: 100px;
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
`;

const Sidebar = styled("div")`
  border: 1px solid ${({ theme }) => theme.palette.divider};
  background-color: ${({ theme }) => theme.palette.background.paper};
  height: 500px;
  right: -400px;
  top: 12px;
  width: 400px;
  z-index: 1300;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  transition: right 0.3s ease-in-out;
  overflow: hidden;
  position: absolute;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 8px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
    height: 50px;
    background-color: ${({ theme }) => theme.palette.background.default};

    .inbox-right {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: flex-end;
      button {
        border: none;
        background-color: transparent;
        cursor: pointer;
        padding: 8px;
        border-radius: ${({ theme }) => theme.shape.borderRadius}px;
        border: 1px solid ${({ theme }) => theme.palette.divider};
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${({ theme }) => theme.palette.text.primary};
        font-family: ${({ theme }) => theme.typography.fontFamily};

        &:hover {
          background-color: ${({ theme }) => theme.palette.action.hover};
        }
      }

      .inbox-close {
        width: 38px;
        height: 38px;
      }
    }

    .inbox-left {
      display: flex;
      align-items: center;
      height: 50px;

      .tabs {
        display: flex;
        align-items: center;
        gap: 20px;

        .tab {
          display: flex;
          align-items: center;
          height: 50px;
          position: relative;
          padding: 0;
          gap: 8px;
          cursor: pointer;

          &:after {
            content: "";
            display: block;
            width: 100%;
            height: 2px;
            background-color: ${({ theme }) => theme.palette.text.primary};
            transition: 0.3s ease-in-out;
            position: absolute;
            bottom: 0;
            left: 0;
            opacity: 0;
          }

          &.active {
            &:after {
              opacity: 1;
            }
          }

          span {
            font-size: 14px;
            color: ${({ theme }) => theme.palette.text.secondary};
          }

          .badge {
            background-color: ${({ theme }) => theme.palette.error.main};
            border-radius: 50%;
            color: ${({ theme }) => theme.palette.common.white};
            font-size: 12px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            width: 20px;
          }
        }
      }
    }
  }

  .footer {
    display: flex;
    justify-content: center;
    border-top: 1px solid ${({ theme }) => theme.palette.divider};
    align-items: center;
    height: 50px;
    cursor: pointer;
    background-color: ${({ theme }) => theme.palette.background.default};

    &:hover {
      background-color: ${({ theme }) => theme.palette.action.hover};
    }
  }

  @media (max-width: 768px) {
    height: 100vh;
    width: 100vw;
    top: 53px !important;
    right: 0;
    border-radius: 0;
    position: fixed;
    transition: transform 0.3s ease-in-out;
  }
`;

export default function Inbox() {
  const { updateNotifications, unread_notifications } = useAuth(
    useShallow((state) => ({
      updateNotifications: state.updateNotifications,
      unread_notifications: state.unread_notifications,
    }))
  );

  const { setActiveTab, activeTab } = useInbox(
    useShallow((state) => ({
      setActiveTab: state.setActiveTab,
      activeTab: state.activeTab,
    }))
  );

  useUnreadNotificationsSubscription({
    onData: ({ data }) => {
      if (data.data?.unreadNotifications) {
        updateNotifications(
          data.data?.unreadNotifications.unread_notification || 0
        );
      }
    },
    onError(error) {
      console.error(error, "errr in notification");
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const { x, y, refs, strategy, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-start",
    middleware: [
      offset(15),
      flip({ fallbackAxisSideDirection: "end" }),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const headingId = useId();

  useLockBody(isOpen);

  return (
    <Wrapper>
      <IconButton
        ref={refs.setReference}
        {...getReferenceProps()}
        aria-label="inbox"
        className="inbox-icon"
      >
        <Badge badgeContent={unread_notifications} color="error">
          <NotificationIcon width={16} height={16} color="#fff" />
        </Badge>
      </IconButton>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <Sidebar
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
            }}
            aria-labelledby={headingId}
            {...getFloatingProps()}
          >
            <div className="header">
              <div className="inbox-left">
                <div className="tabs">
                  <div
                    className={classNames({
                      tab: true,
                      active: activeTab === "inbox",
                    })}
                    onClick={() => {
                      setActiveTab("inbox");
                    }}
                  >
                    <span>Benachrichtigungen</span>
                  </div>
                  <div
                    className={classNames({
                      tab: true,
                      active: activeTab === "archived",
                    })}
                    onClick={() => {
                      setActiveTab("archived");
                    }}
                  >
                    <span>Archiviert</span>
                  </div>
                </div>
              </div>
            </div>
            {activeTab === "inbox" && <InboxContent />}
            {activeTab === "archived" && <ArchiveContent />}
          </Sidebar>
        </FloatingFocusManager>
      )}
    </Wrapper>
  );
}
