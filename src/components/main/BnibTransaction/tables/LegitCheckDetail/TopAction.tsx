import React from "react";
import styled from "styled-components";
import { Button } from "@material-ui/core";

interface IComponentProps {
  setCreateDialogOpen: (b: boolean) => void;
  addButtonVisible: boolean;
}

const RootDiv = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default (props: IComponentProps) => {
  return (
    <RootDiv>
      {props.addButtonVisible && (
        <Button
          color="primary"
          variant="contained"
          onClick={() => props.setCreateDialogOpen(true)}
        >
          Add
        </Button>
      )}
    </RootDiv>
  );
};
