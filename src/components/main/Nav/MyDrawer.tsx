import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  Divider,
  Typography,
  Button,
  // IconButton,
} from "@material-ui/core";
// import { Add as AddIcon } from "@material-ui/icons";

import MenuList from "./MenuList";
import styled from "styled-components";
import CreateDialog from "./CreateDialog";
import { useDispatch } from "react-redux";
import { goPromise } from "src/util/helper";
import { IFavoriteGetAction, getFavorites } from "src/store/favorite";

const useStyles = makeStyles({
  list: {
    width: 400,
  },
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

  const dispatch = useDispatch();
  const { drawerOpen, setDrawerOpen } = props;
  const [createDialogOpen, setCreateDialogOpen] = React.useState<boolean>(
    false
  );

  const silentFetch = React.useCallback(async () => {
    const [err, res] = await goPromise<IFavoriteGetAction>(getFavorites());
    if (err) {
      console.log({ err });
    } else {
      dispatch(res);
    }
  }, [dispatch]);

  const sideList = (
    <div
      className={classes.list}
      role="presentation"
      onKeyDown={() => setDrawerOpen(false)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingRight: "1rem",
        }}
      >
        <BigText variant="h6">Song Library</BigText>
        {/* <IconButton color="primary">
          <AddIcon />
        </IconButton> */}
      </div>
      <Divider />
      <div style={{ padding: "0.5rem" }}>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={() => setCreateDialogOpen(true)}
        >
          Add Song
        </Button>
      </div>
      <MenuList setDrawerOpen={setDrawerOpen} />
    </div>
  );

  return (
    <>
      <Drawer
        anchor="left"
        open={drawerOpen}
        keepMounted
        onClose={() => setDrawerOpen(false)}
      >
        {sideList}
      </Drawer>
      {Boolean(createDialogOpen) && (
        <CreateDialog
          open={createDialogOpen}
          dismiss={() => setCreateDialogOpen(false)}
          refresh={() => silentFetch()}
        />
      )}
    </>
  );
}
