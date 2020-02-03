import _ from "lodash";
import React from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";
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
import { renderSwitchField } from "src/redux-form/renderers";
import { RenderFieldArrayFn } from "src/util/types";
import { updateLegitCheck } from "src/store/bnib-transaction";
import { TLegitCheckInitialValues } from "../../types";
import MultipleImageInput from "src/components/generic/input/MultipleImageInput";

interface IComponentProps {
  legitCheckId: number;
  dismiss: () => void;
  onAfterSubmit: () => void;
  initialValues: TLegitCheckInitialValues;
}

interface IFormProps {
  initial_images: { image_path: string; deleted: boolean }[];
}

function UpdateLegitCheckImagesDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const { legitCheckId, dismiss, handleSubmit, onAfterSubmit } = props;

  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [newLegitCheckImages, setNewLegitCheckImages] = React.useState<any[]>(
    []
  );

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

  const handleSave = React.useCallback(
    async (formValues: IFormProps) => {
      setLoading(true);
      const [err] = await goPromise(
        updateLegitCheck(
          legitCheckId,
          newLegitCheckImages,
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
    [dismiss, snackbar, legitCheckId, onAfterSubmit, newLegitCheckImages]
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
              <MultipleImageInput
                label="New Legit Check Image"
                files={newLegitCheckImages}
                onChange={files => setNewLegitCheckImages(files)}
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
                  {loading ? <CircularProgress size={24} /> : "Save"}
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
