import _ from "lodash";
import React from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import { reduxForm, SubmissionError, InjectedFormProps } from "redux-form";
import { useSnackbar } from "material-ui-snackbar-provider";

import { goPromise } from "src/util/helper";
import BasicDialog from "src/components/generic/dialog/BasicDialog";
import { defectBnibTransactionByCode } from "src/store/bnib-transaction";
import MultipleImageInput from "src/components/generic/input/MultipleImageInput";

interface IComponentProps {
  transactionCode: string;
  dismiss: () => void;
  onAfterSubmit: () => void;
}

interface IFormProps {}

function DefectDialog(
  props: IComponentProps & InjectedFormProps<IFormProps, IComponentProps>
) {
  const { transactionCode, dismiss, handleSubmit, onAfterSubmit } = props;

  const snackbar = useSnackbar();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [defectImages, setDefectImages] = React.useState<any[]>([]);

  const handleSave = React.useCallback(
    async (formValues: IFormProps) => {
      setLoading(true);
      const [err] = await goPromise(
        defectBnibTransactionByCode(transactionCode, true, defectImages)
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
    [transactionCode, dismiss, onAfterSubmit, snackbar, defectImages]
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
              <MultipleImageInput
                label="Defect Image"
                files={defectImages}
                onChange={files => setDefectImages(files)}
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
  form: "defectBnibTransactionDialogForm",
  enableReinitialize: true
})(DefectDialog);
