import _ from "lodash";
import React from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import {
  Field,
  reduxForm,
  SubmissionError,
  InjectedFormProps
} from "redux-form";
import { useSnackbar } from "material-ui-snackbar-provider";

import { goPromise } from "src/util/helper";
import BasicDialog from "src/components/generic/dialog/BasicDialog";
import { requiredValidator } from "src/redux-form/validators";
import {
  createProductBrand,
  IProductBrand,
  getProductBrands,
  IProductBrandGetAction
} from "src/store/product-brand";
import {
  renderTextField,
  renderAutoSuggestField
} from "src/redux-form/renderers";

interface IComponentProps {
  open: boolean;
  dismiss: () => void;
  restartIntervalRun: () => void;
}

interface IFormProps {
  name: string;
  slug: string;
  is_active: boolean | number;
  parent: {
    label: string;
    value: number;
  };
}

function CreateDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const { open, dismiss, handleSubmit, restartIntervalRun } = props;

  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [rootProductBrands, setRootProductBrands] = React.useState<
    IProductBrand[]
  >([]);

  const fetch = React.useCallback(async () => {
    setError("");
    setLoading(true);
    const [err, res] = await goPromise<IProductBrandGetAction>(
      getProductBrands({ offset: 0, limit: 100 }, { parent_id: "0" }, [
        { field: "full_name", dir: "asc" }
      ])
    );
    setLoading(false);
    if (err) {
      console.log({ err });
      setError("error");
    } else {
      setRootProductBrands(res.productBrands);
    }
  }, []);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  const handleSave = React.useCallback(
    async (formValues: IFormProps) => {
      setLoading(true);
      const {
        name,
        slug,
        is_active,
        parent: { value }
      } = formValues;
      const [err] = await goPromise(
        createProductBrand({
          name,
          slug,
          is_active,
          parent_id: value
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
        snackbar.showMessage("Product Brand created.");
      }
    },
    [dismiss, restartIntervalRun, snackbar]
  );

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  const parentProductBrandOptions = React.useMemo(
    () => [
      { value: 0, label: "No Parent" },
      ...rootProductBrands.map(pb => ({ value: pb.id, label: pb.full_name }))
    ],
    [rootProductBrands]
  );

  return (
    <div>
      <BasicDialog
        open={open}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose={!loading}
      >
        <title>Create Product Brand</title>
        <section>
          <form onSubmit={handleSubmit(handleSave)}>
            <>
              <Field
                name="name"
                type="text"
                label="Name*"
                component={renderTextField}
                validate={[requiredValidator]}
                disabled={loading}
              />
              <Field
                name="slug"
                type="text"
                label="Slug*"
                component={renderTextField}
                validate={[requiredValidator]}
                disabled={loading}
              />
              <Field
                name="parent"
                label="Parent Brand*"
                options={parentProductBrandOptions}
                component={renderAutoSuggestField}
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
            </>
          </form>
        </section>
      </BasicDialog>
    </div>
  );
}

export default reduxForm<IFormProps, IComponentProps>({
  form: "createProductBrandDialogForm"
})(CreateDialog);
