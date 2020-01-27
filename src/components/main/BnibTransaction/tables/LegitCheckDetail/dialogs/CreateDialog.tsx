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
  unsignedWholeNumberValidator
} from "src/redux-form/validators";
import { renderTextField, renderSelectField } from "src/redux-form/renderers";
import { createLegitCheckDetail } from "src/store/bnib-transaction";

interface IComponentProps {
  open: boolean;
  dismiss: () => void;
  legit_check_id: number;
  onAfterSubmit: () => void;
}

interface IFormProps {
  checker_initial: string;
  currency: string;
  price: number;
  result: string;
}

function CreateDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const { open, dismiss, legit_check_id, onAfterSubmit, handleSubmit } = props;

  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const handleSave = React.useCallback(
    async (formValues: IFormProps) => {
      setLoading(true);
      const [err] = await goPromise(
        createLegitCheckDetail({ ...formValues, legit_check_id })
      );
      setLoading(false);
      if (err) {
        if (_.has(err, "response.data.errors")) {
          throw new SubmissionError(err.response.data.errors);
        } else {
          setError("error");
        }
      } else {
        dismiss();
        onAfterSubmit();
        snackbar.showMessage("Legit Check Detail created.");
      }
    },
    [dismiss, snackbar, legit_check_id, onAfterSubmit]
  );

  const handleClose = () => {
    dismiss();
  };

  return (
    <div>
      <BasicDialog
        open={open}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose={!loading}
      >
        <title>Create Product</title>
        <section>
          <form onSubmit={handleSubmit(handleSave)}>
            <>
              <Field
                name="checker_initial"
                type="text"
                label="Checker Initial"
                component={renderTextField}
                validate={[requiredValidator]}
                disabled={loading}
              />
              <Field
                name="currency"
                type="text"
                label="Currency"
                component={renderTextField}
                validate={[requiredValidator]}
                disabled={loading}
              />
              <Field
                name="price"
                type="text"
                label="Price"
                component={renderTextField}
                validate={[requiredValidator, unsignedWholeNumberValidator]}
                disabled={loading}
              />
              <Field
                name="result"
                type="text"
                label="Result"
                component={renderSelectField}
                validate={[requiredValidator]}
                disabled={loading}
              >
                <MenuItem value="authentic">Authentic</MenuItem>
                <MenuItem value="indefinable">Indefinable</MenuItem>
                <MenuItem value="fake">Fake</MenuItem>
              </Field>
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
  form: "createLegitCheckDetailDialogForm",
  enableReinitialize: true
})(CreateDialog);
