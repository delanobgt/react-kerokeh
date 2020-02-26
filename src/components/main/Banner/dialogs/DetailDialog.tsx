import React from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";

import BasicDialog from "src/components/generic/dialog/BasicDialog";
import { MyExpansion } from "src/components/generic/detail-dialog";
import { goPromise } from "src/util/helper";
import moment from "moment";
import { getBannerById, IBanner } from "src/store/banner";
import DetailImageDialog from "src/components/generic/dialog/DetailImageDialog";

interface IComponentProps {
  bannerId: number;
  dismiss: () => void;
}

function DetailDialog(props: IComponentProps) {
  const { bannerId, dismiss } = props;
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>("");
  const [banner, setBanner] = React.useState<IBanner>(null);
  const [detailDialogImageUrl, setDetailDialogImageUrl] = React.useState<
    string
  >("");

  const handleClose = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  // initial fetch
  const fetch = React.useCallback(async () => {
    setError("");
    setLoading(true);
    const [errBanner, banner] = await goPromise<IBanner>(
      getBannerById(bannerId)
    );
    setLoading(false);

    if (errBanner) {
      console.log(errBanner);
      setError("error");
    } else {
      setBanner(banner);
    }
  }, [bannerId]);
  React.useEffect(() => {
    fetch();
  }, [fetch]);

  const bannerEntries = React.useMemo(() => {
    if (!banner) return [];
    return [
      { label: "Id", value: banner.id || "n/a" },
      { label: "Title", value: banner.title || "n/a" },
      { label: "Action Type", value: banner.banner_action || "n/a" },
      { label: "Banner Type", value: banner.banner_type || "n/a" },
      { label: "Action Path", value: banner.action_path || "n/a" },
      { label: "View Count", value: banner.view_count },
      { label: "Is Active", value: banner.is_active ? "YES" : "NO" },
      { label: "Created By", value: banner.created_by || "n/a" },
      { label: "Updated By", value: banner.updated_by || "n/a" },
      {
        label: "Expired At",
        value: moment(banner.expired_at).format("D MMMM YYYY")
      },
      {
        label: "Image",
        value: (
          <img
            alt=""
            style={{ width: "100%", cursor: "pointer" }}
            src={banner.image_url}
            onClick={() => setDetailDialogImageUrl(banner.image_url)}
          />
        )
      }
    ];
  }, [banner]);
  return (
    <>
      <BasicDialog
        open={Boolean(bannerId)}
        dismiss={dismiss}
        maxWidth="sm"
        fullWidth
        bgClose
      >
        <title>Product Detail</title>
        <section>
          {loading ? (
            <div style={{ textAlign: "center" }}>
              <CircularProgress size={24} /> Loading...
            </div>
          ) : error ? (
            <Typography variant="subtitle1" color="secondary">
              An error occured, please{" "}
              <span onClick={fetch} style={{ color: "lightblue" }}>
                retry
              </span>
              .
            </Typography>
          ) : banner ? (
            <>
              <div style={{ width: "100%" }}>
                <MyExpansion
                  entry={{ title: "Banner", entries: bannerEntries }}
                  defaultExpanded={true}
                />
              </div>
            </>
          ) : null}
          <div style={{ textAlign: "right" }}>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </section>
      </BasicDialog>
      {Boolean(detailDialogImageUrl) && (
        <DetailImageDialog
          title="Banner Detail Image"
          imageUrl={detailDialogImageUrl}
          dismiss={() => setDetailDialogImageUrl(null)}
        />
      )}
    </>
  );
}

export default DetailDialog;
