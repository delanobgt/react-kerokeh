import _ from "lodash";
import React from "react";
import {
  Button,
  CircularProgress,
  Typography,
  MenuItem
} from "@material-ui/core";
import {
  Field,
  reduxForm,
  SubmissionError,
  InjectedFormProps
} from "redux-form";
import { useSnackbar } from "material-ui-snackbar-provider";

import { goPromise } from "src/util/helper";
import BasicDialog from "src/components/generic/dialog/BasicDialog";
import {
  requiredValidator,
  unsignedRealNumberValidator,
  unsignedWholeNumberValidator
} from "src/redux-form/validators";
import {
  renderTextField,
  renderSelectField,
  renderDateField,
  renderImageField
} from "src/redux-form/renderers";
import { createPromoCode } from "src/store/promo-code";

interface IComponentProps {
  open: boolean;
  dismiss: () => void;
  restartIntervalRun: () => void;
  initialValues: {
    expired_at: string;
  };
}

interface IFormProps {
  active_status: boolean | number;
  code: string;
  description: string;
  expired_at: string;
  limit: number;
  percentage: number;
  product_type: string;
  image: any;
}

function CreateDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const { open, dismiss, handleSubmit, restartIntervalRun } = props;

  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const handleSave = React.useCallback(
    async (formValues: IFormProps) => {
      setLoading(true);
      const [err] = await goPromise(
        createPromoCode(formValues, formValues.image)
      );
      setLoading(false);
      if (err) {
        if (_.has(err, "response.data.errors")) {
          throw new SubmissionError(err.response.data.errors);
        } else {
          setError("error");
        }
      } else {
        restartIntervalRun();
        dismiss();
        snackbar.showMessage("Promo Code created.");
      }
    },
    [dismiss, restartIntervalRun, snackbar]
  );

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  return (
    <div>
      <BasicDialog
        open={open}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose={!loading}
      >
        <title>Create Promo Code</title>
        <section>
          <form onSubmit={handleSubmit(handleSave)}>
            <>
              <Field
                name="code"
                type="text"
                label="Code"
                component={renderTextField}
                validate={[requiredValidator]}
                disabled={loading}
              />
              <Field
                name="percentage"
                type="text"
                label="Percentage"
                component={renderTextField}
                validate={[requiredValidator, unsignedRealNumberValidator]}
                disabled={loading}
              />
              <Field
                name="limit"
                type="text"
                label="Limit"
                component={renderTextField}
                validate={[requiredValidator, unsignedWholeNumberValidator]}
                disabled={loading}
              />
              <Field
                name="description"
                type="text"
                label="Description"
                component={renderTextField}
                validate={[requiredValidator]}
                disabled={loading}
                multiline
                rows="3"
                variant="outlined"
              />
              <Field
                name="product_type"
                label="Product Type"
                component={renderSelectField}
                validate={[requiredValidator]}
                disabled={loading}
              >
                <MenuItem value="bnib_product">BNIB Product</MenuItem>
                <MenuItem value="bnib_buy_order">BNIB Buy Order</MenuItem>
                <MenuItem value="direct_bnib_product">
                  Direct BNIB Product
                </MenuItem>
                <MenuItem value="direct_bnib_buy_order">
                  Direct BNIB Buy Order
                </MenuItem>
              </Field>
              <Field
                name="active_status"
                label="Active Status"
                component={renderSelectField}
                validate={[requiredValidator]}
                disabled={loading}
              >
                <MenuItem value={1}>Active</MenuItem>
                <MenuItem value={0}>Inactive</MenuItem>
              </Field>
              <Field
                name="expired_at"
                type="text"
                label="Expired At"
                component={renderDateField}
                validate={[requiredValidator]}
                disabled={loading}
              />
              <Field
                name="image"
                label="Promo Code Image"
                component={renderImageField}
                validate={[requiredValidator]}
                disabled={loading}
                accept="image/png"
                extensions={["png"]}
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
            </>
          </form>
        </section>
      </BasicDialog>
    </div>
  );
}

export default reduxForm<IFormProps, IComponentProps>({
  form: "createPromoCodeDialogForm"
})(CreateDialog);
