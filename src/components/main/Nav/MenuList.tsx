import _ from "lodash";
import React from "react";
import {
  ListItemIcon,
  ListItemText,
  ListItem,
  List,
  Collapse
} from "@material-ui/core";
import {
  Bookmark as BookmarkIcon,
  Receipt as ReceiptIcon,
  Dashboard as DashboardIcon,
  Image as ImageIcon,
  SettingsApplications as SettingsApplicationsIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  Style as StyleIcon,
  TrendingUp as TrendingUpIcon,
  MoneyOff as MoneyOffIcon,
  VpnKey as VpnKeyIcon,
  ExitToApp as ExitToAppIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Money as MoneyIcon,
  Poll as PollIcon,
  VerticalAlignBottom as VerticalAlignBottomIcon,
  VerticalAlignTop as VerticalAlignTopIcon
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
  link?: string;
  subMenus?: IMenu[];
}

const menuList: IMenu[] = [
  { title: "Dashboard", Icon: DashboardIcon, link: "/dashboard" },
  {
    title: "Banner",
    Icon: ImageIcon,
    link: RoutePath.BANNER
  },
  {
    title: "BNIB Transaction",
    Icon: ReceiptIcon,
    link: RoutePath.BNIB_TRANSACTION
  },
  {
    title: "Config",
    Icon: SettingsApplicationsIcon,
    link: RoutePath.CONFIG
  },
  {
    title: "Deposit Fee",
    Icon: AttachMoneyIcon,
    link: RoutePath.DEPOSIT_FEE
  },
  {
    title: "Product",
    Icon: StyleIcon,
    subMenus: [
      { title: "Product", Icon: StyleIcon, link: RoutePath.PRODUCT },
      {
        title: "Product Brand",
        Icon: StyleIcon,
        link: RoutePath.PRODUCT_BRAND
      },
      {
        title: "Product Category",
        Icon: StyleIcon,
        link: RoutePath.PRODUCT_CATEGORY
      }
    ]
  },
  {
    title: "Promo Code",
    Icon: MoneyOffIcon,
    link: RoutePath.PROMO_CODE
  },
  {
    title: "Product Request",
    Icon: PollIcon,
    link: RoutePath.PRODUCT_REQUEST
  },
  {
    title: "Special Category",
    Icon: BookmarkIcon,
    link: RoutePath.SPECIAL_CATEGORY
  },
  {
    title: "User",
    Icon: PeopleIcon,
    subMenus: [
      {
        title: "User",
        Icon: PeopleIcon,
        link: RoutePath.USER
      },
      {
        title: "Identification",
        Icon: PeopleIcon,
        link: RoutePath.IDENTIFICATION
      }
    ]
  },
  {
    title: "Statistics",
    Icon: TrendingUpIcon,
    subMenus: [
      {
        title: "Revenue",
        Icon: MoneyIcon,
        link: RoutePath.REVENUE
      }
    ]
  },
  {
    title: "Wallet",
    Icon: MoneyIcon,
    subMenus: [
      {
        title: "Withdraw Request",
        Icon: VerticalAlignTopIcon,
        link: RoutePath.WITHDRAW_REQUEST
      },
      {
        title: "Top Up",
        Icon: VerticalAlignBottomIcon,
        link: RoutePath.TOP_UP
      }
    ]
  },
  { title: "Admin User", Icon: VpnKeyIcon, link: RoutePath.ADMIN_USER },
  { title: "Logout", Icon: ExitToAppIcon, link: RoutePath.LOGOUT }
];

export default function MenuList({ setDrawerOpen }: IProps) {
  const { location } = useReactRouter();
  const PADDING_MULTIPLIER = 1.5;

  const [navState, setNavState] = React.useState<Record<string, boolean>>({});
  const toggleCollapse = React.useCallback(
    stateName => {
      console.log(navState, stateName, Boolean(stateName));
      const depth = Number(stateName.split("#")[1]);
      setNavState({
        ..._.mapValues(navState, (value, key) =>
          Number(key.split("#")[1]) >= depth ? false : value
        ),
        [stateName]: !Boolean(navState[stateName])
      });
    },
    [navState, setNavState]
  );
  const renderMenu = React.useCallback(
    (menu: IMenu, path: string, depth: number) => {
      const { link, title, Icon, subMenus } = menu;
      if (link) {
        return (
          <Link key={title} to={link}>
            <ListItem
              button
              selected={location.pathname === link}
              onClick={() => setDrawerOpen(false)}
              style={{ paddingLeft: `${PADDING_MULTIPLIER * (depth + 1)}em` }}
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={title} />
            </ListItem>
          </Link>
        );
      } else if (subMenus) {
        const stateName = `${path}/${title}#${depth}`;
        return (
          <div key={title}>
            <ListItem
              button
              onClick={() => toggleCollapse(stateName)}
              style={{ paddingLeft: `${PADDING_MULTIPLIER * (depth + 1)}em` }}
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={title} />
              {Boolean(navState[stateName]) ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
            </ListItem>

            <Collapse in={Boolean(navState[stateName])} timeout="auto">
              <List component="div" disablePadding>
                {menu.subMenus.map(subMenu =>
                  renderMenu(subMenu, `${path}/${title}`, depth + 1)
                )}
              </List>
            </Collapse>
          </div>
        );
      }
    },
    [location.pathname, navState, setDrawerOpen, toggleCollapse]
  );

  const navList = React.useMemo(() => {
    return _.map(menuList, menu => renderMenu(menu, "", 0));
  }, [renderMenu]);

  return <List>{navList}</List>;
}
