import _ from "lodash";
import React from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import {
  Field,
  reduxForm,
  InjectedFormProps,
  SubmissionError
} from "redux-form";
import { useSnackbar } from "material-ui-snackbar-provider";

import { goPromise } from "src/util/helper";
import BasicDialog from "src/components/generic/dialog/BasicDialog";
import {
  requiredValidator,
  unsignedWholeNumberValidator
} from "src/redux-form/validators";
import { renderTextField } from "src/redux-form/renderers";
import { updateDepositFee, PDepositFee } from "src/store/deposit-fee";

interface IComponentProps {
  productBrandId: number;
  dismiss: () => void;
  restartIntervalRun: () => void;
  initialValues: PDepositFee;
}

interface IFormProps {
  fee: number;
  starting_price: number;
}

function UpdateDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const {
    productBrandId,
    dismiss,
    handleSubmit,
    restartIntervalRun,
    initialValues
  } = props;

  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const handleSave = React.useCallback(
    async (formValues: IFormProps) => {
      console.log({ formValues });
      setLoading(true);
      const { fee, starting_price } = formValues;
      const [errPB] = await goPromise(
        updateDepositFee(initialValues, {
          fee: Number(fee),
          starting_price: Number(starting_price)
        })
      );
      setLoading(false);
      if (errPB) {
        if (_.has(errPB, "response.data.errors")) {
          throw new SubmissionError(errPB.response.data.errors);
        } else {
          setError("error");
        }
      } else {
        restartIntervalRun();
        dismiss();
        snackbar.showMessage("Deposit Fee updated.");
      }
    },
    [dismiss, restartIntervalRun, initialValues, snackbar]
  );

  const handleClose = () => {
    dismiss();
  };

  return (
    <div>
      <BasicDialog
        open={Boolean(productBrandId)}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose={!loading}
      >
        <title>Update Deposit Fee</title>
        <section>
          <form onSubmit={handleSubmit(handleSave)}>
            <Field
              name="fee"
              type="text"
              label="Fee"
              component={renderTextField}
              validate={[requiredValidator, unsignedWholeNumberValidator]}
              disabled={loading}
            />
            <Field
              name="starting_price"
              type="text"
              label="Starting Price"
              component={renderTextField}
              validate={[requiredValidator, unsignedWholeNumberValidator]}
              disabled={loading}
            />
            {error && (
              <Typography variant="subtitle1">
                Something is wrong. Please try again.
              </Typography>
            )}
            <div style={{ textAlign: "right" }}>
              <Button onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </div>
          </form>
        </section>
      </BasicDialog>
    </div>
  );
}

export default reduxForm<IFormProps, IComponentProps>({
  form: "updateDepositFeeDialogForm",
  enableReinitialize: true
})(UpdateDialog);
