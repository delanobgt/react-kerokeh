import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { TextField } from "@material-ui/core";

interface Props {
  title: string;
  message: string;
  visible: boolean;
  dismiss: () => any;
  noCallback?: () => any;
  yesCallback?: (dismiss: () => any) => any;
  confirmText?: string;
}

class ConfirmDialog extends React.Component<Props, {}> {
  state = {
    _confirmText: ""
  };

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

  handleConfirmTextChange = (e: any) => {
    this.setState({ _confirmText: e.target.value });
  };

  render() {
    const { title, message, visible, confirmText } = this.props;
    const { _confirmText } = this.state;

    return (
      <div>
        <Dialog open={visible} onClose={this.handleCancel}>
          <DialogTitle>{title || "<title>"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {message || "<message>"}
            </DialogContentText>
            {Boolean(confirmText) && (
              <div>
                <TextField
                  label={`Please type "${confirmText}"`}
                  value={_confirmText}
                  onChange={this.handleConfirmTextChange}
                  fullWidth
                />
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancel} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.handleOkay}
              color="primary"
              autoFocus
              disabled={Boolean(confirmText) && confirmText !== _confirmText}
            >
              Yeah
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default ConfirmDialog;
