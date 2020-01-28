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
import { updatePromoCode, PPromoCode } from "src/store/promo-code";

interface IComponentProps {
  promoCodeId: number;
  dismiss: () => void;
  restartIntervalRun: () => void;
  initialValues: PPromoCode;
}

interface IFormProps {
  active_status: boolean | number;
  code: string;
  description: string;
  expired_at: string;
  limit: number;
  percentage: number;
  product_type: number;
  image: any;
}

function UpdateDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const {
    initialValues,
    promoCodeId,
    dismiss,
    handleSubmit,
    restartIntervalRun
  } = props;
  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const handleSave = React.useCallback(
    async (formValues: IFormProps) => {
      console.log(formValues);
      setLoading(true);
      const [err] = await goPromise(
        updatePromoCode(initialValues, formValues, formValues.image)
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
        snackbar.showMessage("Promo Code updated.");
      }
    },
    [dismiss, restartIntervalRun, snackbar, initialValues]
  );

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  return (
    <div>
      <BasicDialog
        open={Boolean(promoCodeId)}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose={!loading}
      >
        <title>Update Promo Code</title>
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
                <MenuItem value={1}>BNIB Product</MenuItem>
                <MenuItem value={2}>Direct BNIB Buy Order</MenuItem>
                <MenuItem value={3}>Direct BNIB Product</MenuItem>
                <MenuItem value={4}>BNIB Buy Order</MenuItem>
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
              <div>
                <Typography variant="subtitle1">Current Image</Typography>
                <img
                  src={initialValues.image_url}
                  alt=""
                  style={{ width: "100%" }}
                />
              </div>
              <Field
                name="image"
                label="Replace Image"
                component={renderImageField}
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
  form: "updatePromoCodeDialogForm",
  enableReinitialize: true
})(UpdateDialog);
