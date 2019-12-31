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
import BasicDialog from "src/components/generic/BasicDialog";
import {
  requiredValidator,
  realNumberValidator,
  wholeNumberValidator
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
  product_type: string;
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
  console.log({ initialValues });
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
        snackbar.showMessage("Promo Code created.");
      }
    },
    [dismiss, restartIntervalRun, snackbar, initialValues]
  );

  const handleClose = () => {
    dismiss();
  };

  return (
    <div>
      <BasicDialog
        open={Boolean(promoCodeId)}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose
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
                validate={[requiredValidator, realNumberValidator]}
                disabled={loading}
              />
              <Field
                name="limit"
                type="text"
                label="Limit"
                component={renderTextField}
                validate={[requiredValidator, wholeNumberValidator]}
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
                label="Replace Promo Code Image"
                component={renderImageField}
                disabled={loading}
                accept="image/jpg"
                extensions={["jpg"]}
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
