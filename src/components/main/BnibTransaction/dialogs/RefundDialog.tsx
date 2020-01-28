import _ from "lodash";
import React from "react";
import {
  Button,
  Typography,
  CircularProgress,
  MenuItem
} from "@material-ui/core";
import { useSnackbar } from "material-ui-snackbar-provider";

import BasicDialog from "src/components/generic/dialog/BasicDialog";
import { goPromise } from "src/util/helper";
import { refundBnibTransactionByCode } from "src/store/bnib-transaction";
import { renderSelectField, renderTextField } from "src/redux-form/renderers";
import { requiredValidator } from "src/redux-form/validators";
import { Field, InjectedFormProps, reduxForm } from "redux-form";

interface IComponentProps {
  transactionCode: string;
  onAfterSubmit: () => void;
  dismiss: () => void;
}

interface IFormProps {
  courier_slug: string;
  tracking_code: string;
}

function RefundDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const { transactionCode, onAfterSubmit, dismiss, handleSubmit } = props;
  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  const submit = React.useCallback(
    async (formValues: IFormProps) => {
      setError("");
      setLoading(true);
      const [err] = await goPromise<void>(
        refundBnibTransactionByCode(
          transactionCode,
          formValues.courier_slug,
          formValues.tracking_code
        )
      );
      setLoading(false);

      if (err) {
        console.log(err);
        setError(_.get(err, "response.data.errors", "Something went wrong!"));
      } else {
        onAfterSubmit();
        dismiss();
        snackbar.showMessage("Bnib Transaction Product refunded.");
      }
    },
    [transactionCode, onAfterSubmit, dismiss, snackbar]
  );

  return (
    <div>
      <BasicDialog
        open={Boolean(transactionCode)}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose={!loading}
      >
        <title>Refund BNIB Transaction Product</title>
        <section>
          <form onSubmit={handleSubmit(submit)}>
            <div>
              <Typography variant="subtitle1">
                Please input the Courier and Tracking Code.
              </Typography>
              <Field
                name="courier_slug"
                label="Courier"
                component={renderSelectField}
                validate={[requiredValidator]}
                disabled={loading}
              >
                <MenuItem value=""></MenuItem>
                <MenuItem value="jnt">J&T</MenuItem>
              </Field>
              <Field
                name="tracking_code"
                type="text"
                label="Tracking Code"
                component={renderTextField}
                validate={[requiredValidator]}
                disabled={loading}
              />

              {Boolean(error) && (
                <Typography variant="subtitle2" style={{ color: "red" }}>
                  {error}
                </Typography>
              )}
            </div>
            <div style={{ textAlign: "right", marginTop: "1rem" }}>
              <Button
                onClick={() => handleClose()}
                color="primary"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Send Back"}
              </Button>
            </div>
          </form>
        </section>
      </BasicDialog>
    </div>
  );
}

export default reduxForm<IFormProps, IComponentProps>({
  form: "refundBnibTransactionDialogForm",
  enableReinitialize: true
})(RefundDialog);
