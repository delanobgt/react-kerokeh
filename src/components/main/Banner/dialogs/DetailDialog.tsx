import _ from "lodash";
import React from "react";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import BasicDialog from "src/components/generic/BasicDialog";
import { makeExpansion } from "src/components/generic/detail-dialog";
import { goPromise } from "src/util/helper";
import moment from "moment";
import { getBannerById, IBanner } from "src/store/banner";

interface IComponentProps {
  bannerId: number;
  dismiss: () => void;
}

function DetailDialog(props: IComponentProps) {
  const { bannerId, dismiss } = props;
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>("");
  const [banner, setBanner] = React.useState<IBanner>(null);

  const handleClose = () => {
    dismiss();
  };

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
      { label: "Id", value: banner.id || "-" },
      { label: "Title", value: banner.title || "-" },
      { label: "Action Type", value: banner.banner_action || "-" },
      { label: "Banner Type", value: banner.banner_type || "-" },
      { label: "Action Path", value: banner.action_path || "-" },
      { label: "View Count", value: banner.view_count },
      { label: "Is Active", value: banner.is_active ? "YES" : "NO" },
      { label: "Created By", value: banner.created_by || "-" },
      { label: "Updated By", value: banner.updated_by || "-" },
      {
        label: "Expired At",
        value: moment(banner.expired_at).format("D MMMM YYYY")
      },
      {
        label: "Image",
        value: (
          <div style={{ width: "100%" }}>
            <TransformWrapper style={{ width: "100%" }}>
              <TransformComponent>
                <img alt="" style={{ width: "100%" }} src={banner.image_url} />
              </TransformComponent>
            </TransformWrapper>
          </div>
        )
      }
    ];
  }, [banner]);
  return (
    <div>
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
                {makeExpansion(
                  { title: "Banner", entries: bannerEntries },
                  true
                )}
              </div>
            </>
          ) : null}
          <div style={{ textAlign: "right" }}>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </section>
      </BasicDialog>
    </div>
  );
}

export default DetailDialog;
