import _ from "lodash";
import React from "react";
import {
  Button,
  CircularProgress,
  Typography,
  IconButton
} from "@material-ui/core";
import {
  Field,
  reduxForm,
  InjectedFormProps,
  SubmissionError,
  FieldArray
} from "redux-form";
import { Close as CloseIcon } from "@material-ui/icons";
import { useSnackbar } from "material-ui-snackbar-provider";

import { goPromise } from "src/util/helper";
import BasicDialog from "src/components/generic/BasicDialog";
import { requiredValidator } from "src/redux-form/validators";
import { renderTextField } from "src/redux-form/renderers";
import {
  IProductSize,
  TProductCategory,
  updateProductCategory,
  createProductSize,
  updateProductSize
} from "src/store/product-category";
import { RenderFieldArrayFn } from "src/util/types";

interface IComponentProps {
  productCategoryId: number;
  dismiss: () => void;
  restartIntervalRun: () => void;
  initialValues: TProductCategory;
}

interface IFormProps {
  name: string;
  slug: string;
  productSizes: IProductSize[];
}

function UpdateDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const {
    productCategoryId,
    dismiss,
    handleSubmit,
    restartIntervalRun,
    initialValues
  } = props;

  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const renderProductSizes: RenderFieldArrayFn<IProductSize> = React.useCallback(
    ({ fields }) => (
      <div>
        {!Boolean(fields.length) ? (
          <Typography variant="subtitle1">- no product size yet -</Typography>
        ) : (
          fields
            .map((member: any, index: number) => {
              const field = fields.get(index);
              return {
                key: field.size,
                component: (
                  <div key={index}>
                    <Field
                      name={`${member}.size`}
                      type="text"
                      label="Size"
                      component={renderTextField}
                      validate={[requiredValidator]}
                      fullWidth={false}
                    />
                    {Boolean(!field.id) && (
                      <IconButton onClick={() => fields.remove(index)}>
                        <CloseIcon />
                      </IconButton>
                    )}
                  </div>
                )
              };
            })
            .sort((a, b) => (a.key || "!").localeCompare(b.key || "!"))
            .map(e => e.component)
        )}
        <Button
          variant="outlined"
          color="primary"
          onClick={() =>
            fields.push({ product_category_id: productCategoryId, size: "" })
          }
        >
          Add Product Size
        </Button>
      </div>
    ),
    [productCategoryId]
  );

  const fieldArray = React.useMemo(
    () => (
      /* tslint:disable-next-line */
      <FieldArray name="productSizes" component={renderProductSizes} />
    ),
    [renderProductSizes]
  );

  const handleSave = React.useCallback(
    async (formValues: IFormProps) => {
      setLoading(true);
      const { slug, name } = formValues;
      const [errPC] = await goPromise(
        updateProductCategory(initialValues, {
          id: productCategoryId,
          slug,
          name
        })
      );
      const productSizePromises: Promise<IProductSize>[] = [];
      for (let productSize of formValues.productSizes) {
        if (!productSize.id) {
          productSizePromises.push(createProductSize(productSize));
        } else {
          productSizePromises.push(updateProductSize(productSize));
        }
      }
      const [errPS] = await goPromise(Promise.all(productSizePromises));
      setLoading(false);
      if (errPC || errPS) {
        if (_.has(errPC, "response.data.errors")) {
          throw new SubmissionError(errPC.response.data.errors);
        } else if (_.has(errPS, "response.data.errors")) {
          throw new SubmissionError(errPS.response.data.errors);
        } else {
          setError("error");
        }
      } else {
        restartIntervalRun();
        dismiss();
        snackbar.showMessage("Product Category updated.");
      }
    },
    [productCategoryId, dismiss, restartIntervalRun, initialValues, snackbar]
  );

  const handleClose = () => {
    dismiss();
  };

  return (
    <div>
      <BasicDialog
        open={Boolean(productCategoryId)}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose
      >
        <title>Update Product Category</title>
        <section>
          <form onSubmit={handleSubmit(handleSave)}>
            <Field
              name="id"
              type="text"
              label="Id"
              component={renderTextField}
              validate={[requiredValidator]}
              disabled={true}
            />
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

            <br />
            <br />
            <Typography variant="subtitle2">Product Sizes</Typography>
            <br />
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
          </form>
        </section>
      </BasicDialog>
    </div>
  );
}

export default reduxForm<IFormProps, IComponentProps>({
  form: "updateProductCategoryDialogForm",
  enableReinitialize: true
})(UpdateDialog);
