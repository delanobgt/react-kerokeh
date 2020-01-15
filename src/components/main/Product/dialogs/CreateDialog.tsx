import _ from "lodash";
import React from "react";
import {
  Button,
  CircularProgress,
  Typography,
  MenuItem,
  IconButton
} from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import {
  Field,
  reduxForm,
  SubmissionError,
  InjectedFormProps,
  FieldArray
} from "redux-form";
import { useSnackbar } from "material-ui-snackbar-provider";

import { goPromise } from "src/util/helper";
import BasicDialog from "src/components/generic/BasicDialog";
import { requiredValidator } from "src/redux-form/validators";
import {
  renderTextField,
  renderSelectField,
  renderDateField,
  renderImageField,
  renderAsyncAutoSuggestField
} from "src/redux-form/renderers";
import { RenderFieldArrayFn } from "src/util/types";
import { createProduct } from "src/store/product";
import {
  getProductBrands,
  IProductBrandGetAction
} from "src/store/product-brand";
import {
  IProductCategoryGetAction,
  getProductCategories
} from "src/store/product-category";

interface IComponentProps {
  open: boolean;
  dismiss: () => void;
  restartIntervalRun: () => void;
  initialValues: { release_date: string };
}

interface IFormProps {
  name: string;
  slug: string;
  code: string;
  description: string;
  story: string;
  is_active: boolean | number;
  gender: number;
  color: string;
  release_date: string;
  product_brand_option: {
    label: string;
    value: number;
  };
  product_category_option: {
    label: string;
    value: number;
  };
  display_image: any;
  detail_images: any[];
}

function CreateDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const { open, dismiss, handleSubmit, restartIntervalRun } = props;

  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const renderProducts: RenderFieldArrayFn<any> = React.useCallback(
    ({ fields }) => (
      <div>
        {!Boolean(fields.length) ? (
          <Typography variant="subtitle1">- no detail image yet -</Typography>
        ) : (
          fields
            .map((member: any, index: number) => {
              return {
                key: index,
                component: (
                  <div
                    key={index}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Field
                      name={`${member}`}
                      label="Detail Image"
                      component={renderImageField}
                      validate={[requiredValidator]}
                      disabled={loading}
                      accept="image/png"
                      extensions={["png"]}
                    />
                    <IconButton onClick={() => fields.remove(index)}>
                      <CloseIcon />
                    </IconButton>
                  </div>
                )
              };
            })
            .map(e => e.component)
        )}
        <Button
          variant="outlined"
          color="primary"
          onClick={() => fields.push(null)}
        >
          Add Product Size
        </Button>
      </div>
    ),
    [loading]
  );

  const fieldArray = React.useMemo(
    () => (
      /* tslint:disable-next-line */
      <FieldArray name="detail_images" component={renderProducts} />
    ),
    [renderProducts]
  );

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

  const handleSave = React.useCallback(
    async (formValues: IFormProps) => {
      setLoading(true);
      const [err] = await goPromise(
        createProduct(
          formValues,
          formValues.product_brand_option.value,
          formValues.product_category_option.value,
          formValues.display_image,
          formValues.detail_images
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
        snackbar.showMessage("Product created.");
      }
    },
    [dismiss, restartIntervalRun, snackbar]
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
        bgClose
      >
        <title>Create Product</title>
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
                name="slug"
                type="text"
                label="Slug"
                component={renderTextField}
                validate={[requiredValidator]}
                disabled={loading}
              />
              <Field
                name="code"
                type="text"
                label="Code"
                component={renderTextField}
                validate={[requiredValidator]}
                disabled={loading}
              />
              <Field
                name="color"
                type="text"
                label="Color"
                component={renderTextField}
                validate={[requiredValidator]}
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
                name="story"
                type="text"
                label="Story"
                component={renderTextField}
                validate={[requiredValidator]}
                disabled={loading}
                multiline
                rows="5"
                variant="outlined"
              />
              <Field
                name="release_date"
                type="text"
                label="Release Date"
                component={renderDateField}
                validate={[requiredValidator]}
                disabled={loading}
              />
              <Field
                name="product_brand_option"
                label="Product Brand"
                promiseOptions={productBrandPromiseOptions}
                component={renderAsyncAutoSuggestField}
                validate={[requiredValidator]}
                disabled={loading}
              />
              <Field
                name="product_category_option"
                label="Product Category"
                promiseOptions={productCategoryPromiseOptions}
                component={renderAsyncAutoSuggestField}
                validate={[requiredValidator]}
                disabled={loading}
              />
              <Field
                name="is_active"
                label="Is Active"
                component={renderSelectField}
                validate={[requiredValidator]}
                disabled={loading}
              >
                <MenuItem value={0}>False</MenuItem>
                <MenuItem value={1}>True</MenuItem>
              </Field>
              <Field
                name="gender"
                label="Gender"
                component={renderSelectField}
                validate={[requiredValidator]}
                disabled={loading}
              >
                <MenuItem value={0}>Men</MenuItem>
                <MenuItem value={1}>Women</MenuItem>
                <MenuItem value={2}>Youth</MenuItem>
                <MenuItem value={3}>Infant</MenuItem>
                <MenuItem value={4}>Indefinable</MenuItem>
                <MenuItem value={5}>Unisex</MenuItem>
              </Field>
              <Field
                name="display_image"
                label="Display Image"
                component={renderImageField}
                validate={[requiredValidator]}
                disabled={loading}
                accept="image/png"
                extensions={["png"]}
              />
              {fieldArray}
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
  form: "createProductDialogForm",
  enableReinitialize: true
})(CreateDialog);
