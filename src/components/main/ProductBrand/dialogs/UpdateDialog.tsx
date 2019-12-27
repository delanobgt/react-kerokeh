import _ from "lodash";
import React from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import styled from "styled-components";
import {
  Field,
  reduxForm,
  InjectedFormProps,
  SubmissionError
} from "redux-form";
import { useSnackbar } from "material-ui-snackbar-provider";

import { goPromise } from "src/util/helper";
import BasicDialog from "src/components/generic/BasicDialog";
import { requiredValidator } from "src/redux-form/validators";
import {
  renderTextField,
  renderAutoSuggestField
} from "src/redux-form/renderers";
import {
  PProductBrand,
  IProductBrand,
  updateProductBrand,
  getProductBrands,
  IProductBrandGetAction
} from "src/store/product-brand";

const Span = styled.span`
  display: inline-block;
  color: cornflowerblue;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
`;

type TInitialValues = PProductBrand & {
  parent: {
    label: string;
    value: number;
  };
};

interface IComponentProps {
  productBrandId: number;
  dismiss: () => void;
  restartIntervalRun: () => void;
  initialValues: TInitialValues;
}

interface IFormProps {
  name: string;
  slug: string;
  parent: {
    label: string;
    value: number;
  };
}

function UpdateDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const {
    productBrandId,
    dismiss,
    handleSubmit,
    restartIntervalRun,
    initialValues
  } = props;

  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [rootProductBrands, setRootProductBrands] = React.useState<
    IProductBrand[]
  >([]);
  const [childrenProductBrands, setChildrenProductBrands] = React.useState<
    IProductBrand[]
  >([]);

  const fetch = React.useCallback(async () => {
    setError("");
    setLoading(true);
    console.log("fetching updat dialog now!");
    const [errParent, resParent] = await goPromise<IProductBrandGetAction>(
      getProductBrands({ offset: 0, limit: 100 }, { parent_id: "0" }, [
        { field: "full_name", dir: "asc" }
      ])
    );
    const [errChildren, resChildren] = await goPromise<IProductBrandGetAction>(
      getProductBrands(
        { offset: 0, limit: 100 },
        { parent_id: String(initialValues.id) },
        [{ field: "full_name", dir: "asc" }]
      )
    );
    setLoading(false);
    if (errParent || errChildren) {
      console.log({ errParent, errChildren });
      setError("error");
    } else {
      setRootProductBrands(resParent.productBrands);
      setChildrenProductBrands(resChildren.productBrands);
    }
  }, [initialValues.id]);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  const handleSave = React.useCallback(
    async (formValues: IFormProps) => {
      console.log({ formValues });
      setLoading(true);
      const {
        slug,
        name,
        parent: { value }
      } = formValues;
      const [errPB] = await goPromise(
        updateProductBrand(initialValues, {
          id: productBrandId,
          slug,
          name,
          parent_id: value
        })
      );
      setLoading(false);
      if (errPB) {
        if (_.has(errPB, "response.data.errors")) {
          throw new SubmissionError(errPB.response.data.errors);
        } else {
          setError("error");
        }
      } else {
        restartIntervalRun();
        dismiss();
        snackbar.showMessage("Product Brand updated.");
      }
    },
    [productBrandId, dismiss, restartIntervalRun, initialValues, snackbar]
  );

  const handleClose = () => {
    dismiss();
  };

  const parentProductBrandOptions = React.useMemo(
    () => [
      { value: 0, label: "No Parent" },
      ...rootProductBrands
        .filter(pb => pb.id !== initialValues.id)
        .map(pb => ({ value: pb.id, label: pb.full_name }))
    ],
    [rootProductBrands, initialValues.id]
  );

  return (
    <div>
      <BasicDialog
        open={Boolean(productBrandId)}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose
      >
        <title>Update Product Brand</title>
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
            <Field
              name="parent"
              label="Parent Brand"
              options={parentProductBrandOptions}
              component={renderAutoSuggestField}
              validate={[requiredValidator]}
              disabled={loading}
            />
            <div>
              <Typography variant="subtitle2">
                Children Brand ({childrenProductBrands.length})
              </Typography>
              {!childrenProductBrands.length ? (
                <Typography variant="caption">No children.</Typography>
              ) : (
                childrenProductBrands.map(pb => (
                  <Span key={pb.id}>{pb.full_name}</Span>
                ))
              )}
            </div>
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
  form: "updateProductBrandDialogForm",
  enableReinitialize: true
})(UpdateDialog);
