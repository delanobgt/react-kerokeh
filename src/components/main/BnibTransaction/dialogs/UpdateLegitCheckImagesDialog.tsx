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
import { renderImageField, renderSwitchField } from "src/redux-form/renderers";
import { RenderFieldArrayFn } from "src/util/types";
import { updateLegitCheck } from "src/store/bnib-transaction";
import { TLegitCheckInitialValues } from "../types";

interface IComponentProps {
  legitCheckId: number;
  dismiss: () => void;
  onAfterSubmit: () => void;
  initialValues: TLegitCheckInitialValues;
}

interface IFormProps {
  detail_images: any[];
  initial_images: { image_path: string; deleted: boolean }[];
}

function UpdateLegitCheckImagesDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const { legitCheckId, dismiss, handleSubmit, onAfterSubmit } = props;

  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const renderInitialLegitCheckImages: RenderFieldArrayFn<any> = React.useCallback(
    ({ fields }) => (
      <div>
        <Typography variant="subtitle1">Existing Legit Check Images</Typography>
        {!Boolean(fields.length) ? (
          <Typography variant="body2">- no legit check image yet -</Typography>
        ) : (
          fields
            .map((member: any, index: number) => {
              const field = fields.get(index);
              return {
                key: index,
                component: (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1rem"
                    }}
                  >
                    <img
                      src={field.image_path}
                      alt=""
                      style={{ width: "100px", marginRight: "1rem" }}
                    />
                    <Field
                      name={`${member}.deleted`}
                      label="Dispose"
                      component={renderSwitchField}
                      disabled={loading}
                    />
                  </div>
                )
              };
            })
            .map(e => e.component)
        )}
      </div>
    ),
    [loading]
  );
  const initialLegitCheckImageFieldArray = React.useMemo(
    () => (
      /* tslint:disable-next-line */
      <FieldArray
        name="initial_images"
        component={renderInitialLegitCheckImages}
      />
    ),
    [renderInitialLegitCheckImages]
  );

  const renderDetailImages: RenderFieldArrayFn<any> = React.useCallback(
    ({ fields }) => (
      <div>
        <Typography variant="subtitle1">Add Detail Images</Typography>
        {!Boolean(fields.length) ? (
          <Typography variant="body2">- no legit check image yet -</Typography>
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
                      label="New Legit Check Image"
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
          Add Legit Check Image
        </Button>
      </div>
    ),
    [loading]
  );
  const detailImageFieldArray = React.useMemo(
    () => (
      /* tslint:disable-next-line */
      <FieldArray name="detail_images" component={renderDetailImages} />
    ),
    [renderDetailImages]
  );

  const handleSave = React.useCallback(
    async (formValues: IFormProps) => {
      setLoading(true);
      const [err] = await goPromise(
        updateLegitCheck(
          legitCheckId,
          formValues.detail_images,
          formValues.initial_images
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
        snackbar.showMessage("Legit Check images updated.");
      }
    },
    [dismiss, snackbar, legitCheckId, onAfterSubmit]
  );

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  return (
    <div>
      <BasicDialog
        open={Boolean(legitCheckId)}
        dismiss={dismiss}
        maxWidth="xs"
        fullWidth
        bgClose={!loading}
      >
        <title>Update Legit Check Images</title>
        <section>
          <form onSubmit={handleSubmit(handleSave)}>
            <>
              {initialLegitCheckImageFieldArray}
              <br />
              {detailImageFieldArray}
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
  form: "updateLegitCheckImagesDialogForm",
  enableReinitialize: true
})(UpdateLegitCheckImagesDialog);
