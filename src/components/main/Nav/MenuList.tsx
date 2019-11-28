import React from "react";
import { ListItemIcon, ListItemText, ListItem, List } from "@material-ui/core";
import {
  PeopleAlt as PeopleAltIcon,
  VpnKey as VpnKeyIcon,
  ExitToApp as ExitToAppIcon
} from "@material-ui/icons";
import useReactRouter from "use-react-router";

import Link from "src/components/generic/Link";

interface IProps {
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IMenu {
  title: string;
  Icon: (props: any) => JSX.Element;
  link: string;
}

const menuList: IMenu[] = [
  { title: "Identifications", Icon: PeopleAltIcon, link: "/user" },
  { title: "Users", Icon: PeopleAltIcon, link: "/user" },
  { title: "Admin Users", Icon: VpnKeyIcon, link: "/admin_user" },
  { title: "Logout", Icon: ExitToAppIcon, link: "/logout" }
];

export default function MenuList({ setDrawerOpen }: IProps) {
  const { location } = useReactRouter();

  return (
    <List onClick={() => setDrawerOpen(false)}>
      {menuList.map(({ title, Icon, link }) => {
        return (
          <Link to={link} key={title}>
            <ListItem button selected={location.pathname === link}>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={title} />
            </ListItem>
          </Link>
        );
      })}
    </List>
  );
}
