import _ from "lodash";
import React from "react";
import {
  Button,
  CircularProgress,
  Typography,
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
import BasicDialog from "src/components/generic/dialog/BasicDialog";
import { requiredValidator } from "src/redux-form/validators";
import { renderImageField } from "src/redux-form/renderers";
import { RenderFieldArrayFn } from "src/util/types";
import { defectBnibTransactionByCode } from "src/store/bnib-transaction";

interface IComponentProps {
  transactionCode: string;
  dismiss: () => void;
  onAfterSubmit: () => void;
}

interface IFormProps {
  defect_images: any[];
}

function DefectDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const { transactionCode, dismiss, handleSubmit, onAfterSubmit } = props;

  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const renderImages: RenderFieldArrayFn<any> = React.useCallback(
    ({ fields }) => (
      <div>
        {!Boolean(fields.length) ? (
          <Typography variant="subtitle1">- no defect image yet -</Typography>
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
                      label="Defect Image"
                      component={renderImageField}
                      validate={[requiredValidator]}
                      disabled={loading}
                      accept="image/png,image/jpg,image/jpeg"
                      extensions={["png", "jpg", "jpeg"]}
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
          Add Defect Image
        </Button>
      </div>
    ),
    [loading]
  );

  const fieldArray = React.useMemo(
    () => (
      /* tslint:disable-next-line */
      <FieldArray name="defect_images" component={renderImages} />
    ),
    [renderImages]
  );

  const handleSave = React.useCallback(
    async (formValues: IFormProps) => {
      setLoading(true);
      const [err] = await goPromise(
        defectBnibTransactionByCode(
          transactionCode,
          true,
          formValues.defect_images
        )
      );
      setLoading(false);
      if (err) {
        if (_.has(err, "response.data.errors")) {
          throw new SubmissionError(err.response.data.errors);
        } else {
          setError(_.get(err, "response.data.errors", "Something went wrong!"));
        }
      } else {
        onAfterSubmit();
        dismiss();
        snackbar.showMessage("Defect Images uploaded.");
      }
    },
    [transactionCode, dismiss, onAfterSubmit, snackbar]
  );

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  return (
    <div>
      <BasicDialog
        open={Boolean(transactionCode)}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose={!loading}
      >
        <title>Upload Defect Images</title>
        <section>
          <form onSubmit={handleSubmit(handleSave)}>
            <>
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
  form: "defectBnibTransactionDialogForm",
  enableReinitialize: true
})(DefectDialog);
