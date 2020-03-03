import _ from "lodash";
import React from "react";
import {
  Button,
  CircularProgress,
  Typography,
  MenuItem,
  Collapse,
  FormControlLabel,
  Checkbox
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
import {
  renderTextField,
  renderSelectField,
  renderDateField,
  renderImageField,
  renderAsyncAutoSuggestField
} from "src/redux-form/renderers";
import { createProduct } from "src/store/product";
import {
  getProductBrands,
  IProductBrandGetAction
} from "src/store/product-brand";
import {
  IProductCategoryGetAction,
  getProductCategories
} from "src/store/product-category";
import MultipleImageInput from "src/components/generic/input/MultipleImageInput";

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
  retail_price: number;
  retail_price_currency: string;
  product_brand_option: {
    label: string;
    value: number;
  };
  product_category_option: {
    label: string;
    value: number;
  };
  display_image: any;
}

function CreateDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const { open, dismiss, handleSubmit, restartIntervalRun } = props;

  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [showReleaseDate, setShowReleaseDate] = React.useState<boolean>(false);
  const [productDetailImages, setProductDetailImages] = React.useState<any[]>(
    []
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
      if (!showReleaseDate) formValues.release_date = null;
      setLoading(true);
      const [err] = await goPromise(
        createProduct(
          formValues,
          formValues.product_brand_option.value,
          formValues.product_category_option.value,
          formValues.display_image,
          productDetailImages
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
    [
      dismiss,
      restartIntervalRun,
      snackbar,
      productDetailImages,
      showReleaseDate
    ]
  );

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  return (
    <div>
      <BasicDialog
        open={open}
        dismiss={dismiss}
        maxWidth="sm"
        fullWidth
        bgClose={!loading}
      >
        <title>Create Product</title>
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
                name="code"
                type="text"
                label="Code*"
                component={renderTextField}
                validate={[requiredValidator]}
                disabled={loading}
              />
              <Field
                name="color"
                type="text"
                label="Color*"
                component={renderTextField}
                validate={[requiredValidator]}
                disabled={loading}
              />
              <Field
                name="description"
                type="text"
                label="Description"
                component={renderTextField}
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
                disabled={loading}
                multiline
                rows="5"
                variant="outlined"
              />
              <div style={{ marginBottom: "0.5rem" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showReleaseDate}
                      onChange={() => setShowReleaseDate(!showReleaseDate)}
                    />
                  }
                  label="Input Release Date"
                />
                <Collapse in={showReleaseDate} timeout="auto">
                  <Field
                    name="release_date"
                    type="text"
                    label="Release Date*"
                    component={renderDateField}
                    validate={[requiredValidator]}
                    disabled={loading}
                  />
                </Collapse>
              </div>
              <Field
                name="product_brand_option"
                label="Product Brand*"
                promiseOptions={productBrandPromiseOptions}
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

              <>
                <Typography variant="subtitle1" color="textSecondary">
                  Retail Price
                </Typography>
                <div style={{ display: "flex" }}>
                  <Field
                    name="retail_price_currency"
                    label="Currency*"
                    component={renderSelectField}
                    validate={[requiredValidator]}
                    style={{ minWidth: "100px" }}
                    disabled={loading}
                  >
                    <MenuItem value="IDR">IDR</MenuItem>
                    <MenuItem value="USD">USD</MenuItem>
                  </Field>
                  &nbsp;&nbsp;
                  <Field
                    name="retail_price"
                    type="text"
                    label="Value*"
                    component={renderTextField}
                    validate={[requiredValidator, unsignedWholeNumberValidator]}
                    style={{ flexGrow: 1 }}
                    disabled={loading}
                  />
                </div>
              </>

              <Field
                name="is_active"
                label="Is Active*"
                component={renderSelectField}
                validate={[requiredValidator]}
                disabled={loading}
              >
                <MenuItem value={0}>False</MenuItem>
                <MenuItem value={1}>True</MenuItem>
              </Field>
              <Field
                name="gender"
                label="Gender*"
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
                label="Display Image*"
                component={renderImageField}
                validate={[requiredValidator]}
                disabled={loading}
                accept="image/png,image/jpg,image/jpeg"
                extensions={["png", "jpg", "jpeg"]}
              />
              <MultipleImageInput
                label="Product Detail Image*"
                files={productDetailImages}
                onChange={files => setProductDetailImages(files)}
                accept="image/png,image/jpg,image/jpeg"
                extensions={["png", "jpg", "jpeg"]}
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
  form: "createProductDialogForm",
  enableReinitialize: true
})(CreateDialog);
