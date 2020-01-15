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
  wholeNumberValidator
} from "src/redux-form/validators";
import {
  renderTextField,
  renderSelectField,
  renderImageField,
  renderAsyncAutoSuggestField
} from "src/redux-form/renderers";
import { updateSpecialCategoryList } from "src/store/special-category-list";
import {
  getProductBrands,
  IProductBrandGetAction
} from "src/store/product-brand";
import { TInitialValues } from "../types";

interface IComponentProps {
  specialCategoryListId: number;
  dismiss: () => void;
  restartIntervalRun: () => void;
  initialValues: TInitialValues;
}

interface IFormProps {
  name: string;
  priority: number;
  published: number | boolean;
  product_brand_option: {
    label: string;
    value: number;
  };
  image: any;
}

function UpdateDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const {
    specialCategoryListId,
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
      setLoading(true);
      const {
        name,
        priority,
        published,
        product_brand_option,
        image
      } = formValues;
      const [err] = await goPromise(
        updateSpecialCategoryList(
          initialValues,
          {
            name,
            priority: Number(priority),
            published: Boolean(published),
            product_brand_id: product_brand_option.value
          },
          image
        )
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
        snackbar.showMessage("Special Category List updated.");
      }
    },
    [dismiss, restartIntervalRun, initialValues, snackbar]
  );

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  const productBrandPromiseOptions = React.useCallback(
    (inputValue: string) =>
      new Promise(async resolve => {
        const [, res] = await goPromise<IProductBrandGetAction>(
          getProductBrands(
            { offset: 0, limit: 100 },
            { full_name: inputValue },
            []
          )
        );
        const options = res.productBrands.map(pb => ({
          label: pb.full_name,
          value: pb.id
        }));
        resolve(options);
      }),
    []
  );

  return (
    <div>
      <BasicDialog
        open={Boolean(specialCategoryListId)}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose
      >
        <title>Update Special Category List</title>
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
              name="priority"
              type="text"
              label="Priority"
              component={renderTextField}
              validate={[requiredValidator, wholeNumberValidator]}
              disabled={loading}
            />
            <Field
              name="published"
              label="Published"
              component={renderSelectField}
              validate={[requiredValidator]}
              disabled={loading}
            >
              <MenuItem value={0}>False</MenuItem>
              <MenuItem value={1}>True</MenuItem>
            </Field>
            <div>
              <Typography variant="subtitle1">Current Image</Typography>
              <img
                src={initialValues.image_path}
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
            <Field
              name="product_brand_option"
              label="Product Brand"
              promiseOptions={productBrandPromiseOptions}
              component={renderAsyncAutoSuggestField}
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
                {loading ? <CircularProgress size={24} /> : "Save"}
              </Button>
            </div>
          </form>
        </section>
      </BasicDialog>
    </div>
  );
}

export default reduxForm<IFormProps, IComponentProps>({
  form: "updateSpecialCategoryListDialogForm",
  enableReinitialize: true
})(UpdateDialog);
