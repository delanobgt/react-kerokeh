import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Drawer, Divider, Typography } from "@material-ui/core";

import MenuList from "./MenuList";
import styled from "styled-components";

const useStyles = makeStyles({
  list: {
    width: 250
  }
});

const BigText = styled(Typography)`
  padding: 1rem;
`;

interface IProps {
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TemporaryDrawer(props: IProps) {
  const classes = useStyles({});

  const { drawerOpen, setDrawerOpen } = props;

  const sideList = (
    <div
      className={classes.list}
      role="presentation"
      onKeyDown={() => setDrawerOpen(false)}
    >
      <BigText variant="h6" className="m-4">
        Depatu Buy &amp; Sell Admin Panel
      </BigText>
      <Divider />
      <MenuList setDrawerOpen={setDrawerOpen} />
    </div>
  );

  return (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      {sideList}
    </Drawer>
  );
}
