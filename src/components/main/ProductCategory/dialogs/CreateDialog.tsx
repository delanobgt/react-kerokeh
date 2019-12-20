import _ from "lodash";
import React from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import {
  Field,
  reduxForm,
  SubmissionError,
  InjectedFormProps
} from "redux-form";

import { goPromise } from "src/util/helper";
import BasicDialog from "src/components/generic/BasicDialog";
import { requiredValidator } from "src/redux-form/validators";
import { createProductCategory } from "src/store/product-categories";
import { renderTextField } from "src/redux-form/renderers";

interface IComponentProps {
  open: boolean;
  dismiss: () => void;
  restartIntervalRun: () => void;
}

interface IFormProps {
  name: string;
  slug: string;
}

function CreateDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const { open, dismiss, handleSubmit, restartIntervalRun } = props;

  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const handleSave = async (formValues: IFormProps) => {
    setLoading(true);
    const { name, slug } = formValues;
    const [err] = await goPromise(
      createProductCategory({
        name,
        slug
      })
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
    }
  };

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
        bgClose
      >
        <title>Create New Product Category</title>
        <section>
          <form onSubmit={handleSubmit(handleSave)}>
            <Field
              name="name"
              type="text"
              label="Name"
              component={renderTextField}
              validate={[requiredValidator]}
              disabled={loading}
            />
            <Field
              name="slug"
              type="text"
              label="Slug"
              component={renderTextField}
              validate={[requiredValidator]}
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
  form: "createProductCategoryDialogForm"
})(CreateDialog);
