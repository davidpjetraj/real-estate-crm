"use client";
import {
  alpha,
  Backdrop,
  Button,
  darken,
  IconButton,
  lighten,
  styled,
  useMediaQuery,
} from "@mui/material";

import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSettingsContext } from "../settings";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import RouteIcon from "@mui/icons-material/Route";
import MenuIcon from "@mui/icons-material/Menu";
import InviteMemberDialog from "../Dialog/InviteMemberDialog";
import Logo from "@/app/logo";

const Wrapper = styled("div")`
  z-index: 0;
  overflow: hidden;
  display: flex;
  width: 70px;
  height: 100%;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  border: 1px solid ${({ theme }) => theme.palette.divider};
  ${({ theme }) => theme.breakpoints.down("lg")} {
    width: 0;
    position: fixed;
    top: 0;
    height: 100vh;
    left: 0;
    z-index: 1199;
  }

  &.opened {
    width: 340px;
    height: 100%;
    @media (max-width: 600px) {
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
    }
    .sidebar-header,
    .wrapper,
    .sidebar-wrapper {
      width: 100%;
    }

    .items {
      transition: display 0.3s ease-in-out;

      span {
        display: flex;
        transition: display 0.3s ease-in-out;
      }
      p {
        display: flex;
        font-size: 14px;
        font-weight: 500;
        color: ${({ theme }) => theme.palette.text.secondary};
        margin-bottom: 5px;
        margin-top: 0;
        margin-left: 15px;
      }
    }

    .bottom {
      display: flex;
    }
    .sidebar-header {
      overflow: hidden;
      ${({ theme }) => theme.breakpoints.down("lg")} {
        border-top: 0;
        border-bottom: 0;
        border-left: 0;
        border-radius: 0;
      }

      .left {
        display: flex;
        width: 100%;
        align-items: center;
        background-color: ${({ theme }) => theme.palette.background.paper};
        .side {
          display: flex;
          align-items: center;
          height: 64px;
          justify-content: space-between;
          padding: 0 10px;
          width: 100%;
          border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
        }

        .logo {
          display: flex;
          align-items: center;
          color: ${({ theme }) => theme.palette.text.primary};
          font-size: 20px;
          gap: 10px;
          text-decoration: none;
          span {
            font-weight: 600;
          }
          .icon {
            height: 27px;
            width: 27px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          svg {
            height: 27px;
            color: ${({ theme }) => theme.palette.text.primary};
          }
        }
      }
    }
  }

  .sidebar-header {
    overflow: hidden;
    width: 100%;
    background-color: ${({ theme }) => theme.palette.background.paper};

    .left {
      display: flex;
      justify-content: center;
      @media (max-width: 1024px) {
        display: none;
      }
      button {
      }

      .side {
        display: flex;
        height: 64px;
        border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
        width: 100%;
        justify-content: center;
        align-items: center;
        button {
          height: 40px;
          width: 40px;
          svg {
            color: ${({ theme }) => theme.palette.text.primary};
          }
        }
      }
      .logo {
        display: none;
      }
    }
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: ${({ theme }) => theme.palette.background.paper};
    height: calc(100% - 64px);
  }

  .bottom {
    padding: 15px;
    display: none;
    flex-direction: column;
    gap: 5px;
    border-top: 1px solid ${({ theme }) => theme.palette.divider};
    button {
      width: 100%;
    }
  }

  .items {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 16px 10px;
    width: 100%;

    span {
      display: none;
    }

    p {
      display: none;
    }
  }

  a {
    text-decoration: none;
    align-items: center;
    color: ${({ theme }) => theme.palette.text.primary};
    font-weight: 500;
    font-size: 16px;

    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
    width: 100%;
  }
  .submenu {
    padding-left: 20px;
    display: flex;
    gap: 5px;
    flex-direction: column;
  }
`;

const LinkItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  &:hover,
  &.active {
    color: ${({ theme }) => {
      if (theme.palette.mode === "light") {
        return darken(theme.palette.primary.main, 0.2);
      }
      return lighten(theme.palette.primary.main, 0.2);
    }};
    background-color: ${({ theme }) => {
      return alpha(theme.palette.primary.main, 0.08);
    }};
  }
  .icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

function Item({ href, children, icon, ...rest }: any) {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const { onToggle } = useSettingsContext();
  return (
    <LinkItem
      href={href}
      onClick={isMobile ? onToggle : undefined}
      className={classNames({
        active: pathname.includes(rest.includes),
      })}
      {...rest}
    >
      <div className="icon">{icon}</div>
      {children}
    </LinkItem>
  );
}

export default function Sidebar() {
  const { open, onToggle } = useSettingsContext();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  return (
    <>
      <Backdrop
        open={open && isMobile}
        style={{
          backdropFilter: "blur(5px)",
          zIndex: 1198,
        }}
        onClick={onToggle}
      />
      <Wrapper
        className={classNames({
          opened: open,
        })}
      >
        <div className="sidebar-header">
          <div className="left">
            <div className="side">
              {open && <Logo width={50} height={50} />}
              <IconButton onClick={onToggle}>
                <MenuIcon />
              </IconButton>
            </div>
          </div>

          <div className="wrapper sidebar-wrapper">
            <div className="items">
              <Item
                href="/dashboard"
                icon={<DashboardOutlinedIcon />}
                includes="dashboard"
              >
                <span>Dashboard</span>
              </Item>
              <Item href="/team" icon={<GroupOutlinedIcon />} includes="team">
                <span>Team</span>
              </Item>
              <Item
                href="/property"
                icon={<ApartmentOutlinedIcon />}
                includes="property"
              >
                <span>Property</span>
              </Item>
              <Item
                href="/request"
                icon={<AssignmentOutlinedIcon />}
                includes="request"
              >
                <span>Request</span>
              </Item>
              <Item
                href="/client"
                icon={<PeopleAltOutlinedIcon />}
                includes="client"
              >
                <span>Client</span>
              </Item>
              <Item
                href="/state"
                icon={<LocationOnOutlinedIcon />}
                includes="state"
              >
                <span>States</span>
              </Item>
              <Item
                href="/city"
                icon={<LocationCityOutlinedIcon />}
                includes="city"
              >
                <span>Cities</span>
              </Item>
              <Item href="/street" icon={<RouteIcon />} includes="street">
                <span>Streets</span>
              </Item>
            </div>
            <div className="bottom">
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setInviteDialogOpen(true)}
              >
                Invite members
              </Button>
            </div>
          </div>
        </div>
      </Wrapper>
      <InviteMemberDialog
        open={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
      />
    </>
  );
}
