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
  nonZeroWholeNumberValidator
} from "src/redux-form/validators";
import {
  renderTextField,
  renderAsyncAutoSuggestField,
  renderSelectField,
  renderErrorMessage
} from "src/redux-form/renderers";
import {
  IProductCategoryGetAction,
  getProductCategories
} from "src/store/product-category";
import { IProductGetAction, getProducts } from "src/store/product";
import { updateFeaturedProduct } from "src/store/featured-product";
import { TInitialValues } from "../types";

interface IComponentProps {
  featuredProductId: number;
  dismiss: () => void;
  restartIntervalRun: () => void;
  initialValues: TInitialValues;
}

interface IFormProps {
  priority: number;
  published: number | boolean;
  product_option: {
    label: string;
    value: number;
  };
  product_category_option: {
    label: string;
    value: number;
  };
}

function UpdateDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const {
    featuredProductId,
    dismiss,
    handleSubmit,
    restartIntervalRun,
    initialValues
  } = props;

  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const productCategoryPromiseOptions = React.useCallback(
    (inputValue: string) =>
      new Promise(async resolve => {
        const [, res] = await goPromise<IProductCategoryGetAction>(
          getProductCategories(
            { offset: 0, limit: 100 },
            { name: inputValue },
            []
          )
        );
        const options = res.productCategories.map(pb => ({
          label: pb.name,
          value: pb.id
        }));
        resolve(options);
      }),
    []
  );

  const productPromiseOptions = React.useCallback(
    (inputValue: string) =>
      new Promise(async resolve => {
        const [, res] = await goPromise<IProductGetAction>(
          getProducts({ offset: 0, limit: 100 }, { name: inputValue }, [])
        );
        const options = res.products.map(pb => ({
          label: pb.name,
          value: pb.id
        }));
        resolve(options);
      }),
    []
  );

  const handleSave = React.useCallback(
    async (formValues: IFormProps) => {
      setLoading(true);
      const {
        published,
        priority,
        product_option,
        product_category_option
      } = formValues;
      const [err] = await goPromise(
        updateFeaturedProduct(initialValues, {
          id: featuredProductId,
          published: Boolean(published),
          priority: Number(priority),
          product_id: product_option.value,
          product_category_id: product_category_option.value
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
        snackbar.showMessage("Featured Product updated.");
      }
    },
    [dismiss, restartIntervalRun, snackbar, featuredProductId, initialValues]
  );

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  return (
    <div>
      <BasicDialog
        open={Boolean(featuredProductId)}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose={!loading}
      >
        <title>Update Featured Product</title>
        <section>
          <form onSubmit={handleSubmit(handleSave)}>
            <>
              <Field
                name="priority"
                type="text"
                label="Priority*"
                component={renderTextField}
                validate={[requiredValidator, nonZeroWholeNumberValidator]}
                disabled={loading}
              />
              <Field
                name="published"
                label="Published*"
                component={renderSelectField}
                validate={[requiredValidator]}
                disabled={loading}
              >
                <MenuItem value={0}>False</MenuItem>
                <MenuItem value={1}>True</MenuItem>
              </Field>
              <Field
                name="product_option"
                label="Product*"
                promiseOptions={productPromiseOptions}
                component={renderAsyncAutoSuggestField}
                validate={[requiredValidator]}
                disabled={loading}
              />
              <Field
                name="product_category_option"
                label="Product Category*"
                promiseOptions={productCategoryPromiseOptions}
                component={renderAsyncAutoSuggestField}
                validate={[requiredValidator]}
                disabled={loading}
              />
              <Field name="product_id" component={renderErrorMessage} />
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
  form: "updateFeaturedProductDialogForm",
  enableReinitialize: true
})(UpdateDialog);
