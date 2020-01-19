import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

interface Props {
  title: string;
  message: string;
  visible: boolean;
  dismiss: () => any;
  noCallback?: () => any;
  yesCallback?: (dismiss: () => any) => any;
}

class ConfirmDialog extends React.Component<Props, {}> {
  handleCancel = () => {
    const { dismiss, noCallback } = this.props;
    if (noCallback) {
      noCallback();
    }
    dismiss();
  };

  handleOkay = () => {
    const { dismiss, yesCallback } = this.props;
    if (yesCallback) {
      yesCallback(dismiss);
    }
  };

  render() {
    const { title, message, visible } = this.props;

    return (
      <div>
        <Dialog
          open={visible}
          onClose={this.handleCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {title || "<title>"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {message || "<message>"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleOkay} color="primary" autoFocus>
              Yeah
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default ConfirmDialog;
