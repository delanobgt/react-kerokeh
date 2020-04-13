import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  MenuItem,
  Menu,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
} from "@material-ui/icons";

import Link from "../../generic/Link";
import MyDrawer from "./MyDrawer";
import "src/components/main/Auth/style.css";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { IAuthUser } from "src/store/auth";
import UpdateUserDialog from "./UpdateUserDialog";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "block",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
}));

export default function PrimarySearchAppBar() {
  const classes = useStyles({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState<boolean>(
    false
  );

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (): void => {
    setAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";

  const user = useSelector<RootState, IAuthUser>((state) => state.auth.user);

  return (
    <>
      <div className={classes.grow}>
        <AppBar position="fixed" color="secondary">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              className={classes.title}
              variant="h5"
              color="inherit"
              noWrap
            >
              <strong className="kerokeh-title">KEROKEH</strong>
            </Typography>

            <div className={classes.grow} />
            {user && (
              <Typography variant="subtitle1" color="primary">
                <strong>
                  {user.name} ({user.email})
                </strong>
              </Typography>
            )}
            <div>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircleIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          id={menuId}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => setUpdateDialogOpen(true)}>
            <Typography>Edit Profile</Typography>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Link to="/logout">Logout</Link>
          </MenuItem>
        </Menu>
        <MyDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
      </div>
      {Boolean(updateDialogOpen) && (
        <UpdateUserDialog
          open={updateDialogOpen}
          dismiss={() => setUpdateDialogOpen(false)}
        />
      )}
    </>
  );
}
