import React, { ReactNode } from "react";
import Button from "@material-ui/core/Button";
import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useChildProps from "src/hooks/useChildren";

interface IProps extends DialogProps {
  dismiss: () => undefined | any; // the dismiss method to use to dismiss the dialog
  noCallback?: () => any; // the callback for no button
  yesCallback?: (dismiss: () => any) => any; // the callback for yes button
  bgClose?: boolean; // whether enable dismiss by clicking background
  noText?: string; // no button text
  yesText?: string; // yes button text
  showNoAction?: boolean; // whether show the no button
  showYesAction?: boolean; // whether show the yes button
  children?: ReactNode; // children
}

const BasicDialog = (props: IProps) => {
  const childProps = useChildProps(props.children, [
    "title",
    "details",
    "section"
  ]);

  const handleCancel = () => {
    const { dismiss, noCallback } = props;
    if (noCallback) {
      noCallback();
    }
    dismiss();
  };

  const handleOkay = () => {
    const { dismiss, yesCallback } = props;
    if (yesCallback) {
      yesCallback(dismiss);
    }
  };

  const {
    noText,
    yesText,
    showNoAction,
    showYesAction,
    bgClose,
    open,
    dismiss,
    ...restProps
  } = props;

  return (
    <div>
      <Dialog
        open={open}
        onClose={bgClose ? handleCancel : null}
        {...restProps}
      >
        <DialogTitle>
          {childProps.title && <div {...childProps.title} />}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {childProps.details && <span {...childProps.details} />}
          </DialogContentText>
          {childProps.section && <div {...childProps.section} />}
        </DialogContent>

        <DialogActions>
          {showNoAction || noText ? (
            <Button onClick={handleCancel} color="primary">
              {noText || "Cancel"}
            </Button>
          ) : null}
          {showYesAction || yesText ? (
            <Button onClick={handleOkay} color="primary" autoFocus>
              {yesText || "Okay"}
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BasicDialog;
