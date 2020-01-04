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
import { createSpecialCategoryList } from "src/store/special-category-list";
import {
  getSpecialCategories,
  ISpecialCategoryGetAction
} from "src/store/special-category";
import {
  getProductBrands,
  IProductBrandGetAction
} from "src/store/product-brand";

interface IComponentProps {
  open: boolean;
  dismiss: () => void;
  restartIntervalRun: () => void;
}

interface IFormProps {
  name: string;
  priority: number;
  published: boolean | number;
  product_brand: {
    label: string;
    value: number;
  };
  special_category: {
    label: string;
    value: number;
  };
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
      const {
        name,
        published,
        priority,
        product_brand,
        special_category,
        image
      } = formValues;
      setLoading(true);
      const [err] = await goPromise(
        createSpecialCategoryList(
          {
            name,
            published,
            priority,
            product_brand_id: product_brand.value,
            special_category_id: special_category.value
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
        snackbar.showMessage("Special Category List created.");
      }
    },
    [dismiss, restartIntervalRun, snackbar]
  );

  const handleClose = () => {
    dismiss();
  };

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
        console.log({ options });
        resolve(options);
      }),
    []
  );

  const specialCategoryPromiseOptions = React.useCallback(
    (inputValue: string) =>
      new Promise(async resolve => {
        const [, res] = await goPromise<ISpecialCategoryGetAction>(
          getSpecialCategories(
            { offset: 0, limit: 100 },
            { name: inputValue },
            []
          )
        );
        const options = res.specialCategories.map(sc => ({
          label: sc.name,
          value: sc.id
        }));
        resolve(options);
      }),
    []
  );

  return (
    <div>
      <BasicDialog
        open={open}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose
      >
        <title>Create New Special Category List</title>
        <section>
          <form onSubmit={handleSubmit(handleSave)}>
            <>
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
                <MenuItem value={0}>True</MenuItem>
              </Field>
              <Field
                name="image"
                label="Special Category List Image"
                component={renderImageField}
                validate={[requiredValidator]}
                disabled={loading}
                accept="image/png"
                extensions={["png"]}
              />
              <Field
                name="product_brand"
                label="Product Brand"
                promiseOptions={productBrandPromiseOptions}
                component={renderAsyncAutoSuggestField}
                validate={[requiredValidator]}
                disabled={loading}
              />
              <Field
                name="special_category"
                label="Special Category"
                promiseOptions={specialCategoryPromiseOptions}
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
  form: "createSpecialCategoryListDialogForm"
})(CreateDialog);
