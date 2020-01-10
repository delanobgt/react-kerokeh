import React from "react";
import {
  ListItemIcon,
  ListItemText,
  ListItem,
  List,
  Collapse
} from "@material-ui/core";
import {
  PeopleAlt as PeopleAltIcon,
  VpnKey as VpnKeyIcon,
  ExitToApp as ExitToAppIcon
} from "@material-ui/icons";
import useReactRouter from "use-react-router";

import Link from "src/components/generic/Link";
import { RoutePath } from "src/Router/routes";

interface IProps {
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IMenu {
  title: string;
  Icon: (props: any) => JSX.Element;
  link: string;
}

const menuList: IMenu[] = [
  { title: "Dashboard", Icon: PeopleAltIcon, link: "/dashboard" },
  { title: "Product", Icon: PeopleAltIcon, link: RoutePath.PRODUCT },
  {
    title: "Product Brand",
    Icon: PeopleAltIcon,
    link: RoutePath.PRODUCT_BRAND
  },
  {
    title: "Product Category",
    Icon: PeopleAltIcon,
    link: RoutePath.PRODUCT_CATEGORY
  },
  { title: "Logout", Icon: ExitToAppIcon, link: RoutePath.LOGOUT }
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
