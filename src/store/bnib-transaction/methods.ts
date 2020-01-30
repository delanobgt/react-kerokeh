import celestineApi from "src/apis/celestine";
import { IBnibTransaction, ILegitCheck, ILegitCheckDetail, PLegitCheckDetail } from "./types";
import { PRIMARY_ROUTE, SECONDARY_ROUTE, TERNARY_ROUTE } from "./constants";

export const getBnibTransactionByCode = async (code: string): Promise<IBnibTransaction> => {
  const response = await celestineApi().get(`${PRIMARY_ROUTE}/${code}`);
  const transaction: IBnibTransaction = response.data;
  transaction.accessLog = JSON.parse(transaction.access_log);
  transaction.product_detail.detail_image_urls = transaction.product_detail.detail_image_url.split(/,/);
  transaction.defected_image_urls = transaction.defected_image_url ? transaction.defected_image_url.split(/,/) : [];
  return transaction;
};

export const arriveBnibTransactionByCode = async (code: string): Promise<void> => {
  await celestineApi().post(`${PRIMARY_ROUTE}/${code}/arrived`);
};

export const acceptBnibTransactionByCode = async (code: string): Promise<void> => {
  await celestineApi().post(`${PRIMARY_ROUTE}/${code}/accepted`);
};

export const rejectBnibTransactionByCode = async (code: string, reason: string): Promise<void> => {
  await celestineApi().post(`${PRIMARY_ROUTE}/${code}/rejected`, { reject_reason: reason });
};

export const refundBnibTransactionByCode = async (code: string, courier_slug: string, tracking_code: string): Promise<void> => {
  await celestineApi().post(`${PRIMARY_ROUTE}/${code}/refund`, { courier_slug, tracking_code });
};

export const defectBnibTransactionByCode = async (code: string, defect: boolean, images?: any[]): Promise<void> => {
  const formData = new FormData();
  formData.append("is_defect", String(defect));
  if (defect) {
    for (let image of images) {
      formData.append("defect_images[]", image);
    }
  } 
  await celestineApi().post(`${PRIMARY_ROUTE}/${code}/defect`, formData);
};

export const legitCheckBnibTransactionByCode = async (code: string, result: string): Promise<void> => {
  await celestineApi().post(`${PRIMARY_ROUTE}/${code}/lc`, { result });
};

export const sendBnibTransactionByCode = async (code: string, courier_slug: string, tracking_code: string, shipping_cost: number): Promise<void> => {
  await celestineApi().post(`${PRIMARY_ROUTE}/${code}/send`, { courier_slug, tracking_code, shipping_cost });
};

export const disputeBnibTransactionByCode = async (code: string, reject_reason: string): Promise<void> => {
  await celestineApi().post(`${PRIMARY_ROUTE}/${code}/disputed`, { reject_reason });
};

// Legit Check
export const getLegitCheckByBnibTransactionId = async (id: number): Promise<ILegitCheck> => {
  const response = await celestineApi().get(`${SECONDARY_ROUTE}`, { params: { bnib_transaction_id: id } });
  const legitCheck: ILegitCheck = (response.data.data && response.data.data.length) ? response.data.data[0] : null;
  if (legitCheck) legitCheck.image_urls = legitCheck.image_url ? legitCheck.image_url.split(/,/) : [];
  return legitCheck;
};

export const createLegitCheck = async (bnibTransactionId: number): Promise<void> => {
  const formData = new FormData();
  formData.append('bnib_transaction_id', String(bnibTransactionId));
  await celestineApi().post(`${SECONDARY_ROUTE}`, formData);
};

export const updateLegitCheck = async (legitCheckId: number, detail_images: any[],
  initial_images: { image_path: string; deleted: boolean }[]): Promise<void> => {
  const formData = new FormData();
  if (detail_images) {
    console.log({detail_images})
    for (let image of detail_images)
      formData.append("new_images[]", image);
  }
  const deleted_detail_images = initial_images
    .filter(img => img.deleted)
    .map(img => img.image_path)
    .join(",");
    if (Boolean(deleted_detail_images)) {    
      console.log({deleted_detail_images})
      formData.append("deleted_images", deleted_detail_images);
    } 
  await celestineApi().patch(`${SECONDARY_ROUTE}/${legitCheckId}`, formData);
};

export const publishFinalResult = async (
  id:number, final_result: string
): Promise<void> => {
  const response = await celestineApi().patch(
    `${SECONDARY_ROUTE}/${id}/result`, {final_result}
  );
  return response.data;
};

// Legit Check Detail
export const getLegitCheckDetails = async (legit_check_id: number): Promise<ILegitCheckDetail[]> => {
  const response = await celestineApi().get(`${TERNARY_ROUTE}`, {
    params: {
      legit_check_id
    }
  });
  const legitCheckDetails: ILegitCheckDetail[] = response.data.data;
  return legitCheckDetails;
};

export const getLegitCheckDetailById = async (id: number): Promise<ILegitCheckDetail> => {
  const response = await celestineApi().get(`${TERNARY_ROUTE}/${id}`, {
  });
  return response.data;
};

export const createLegitCheckDetail = async (legitCheckDetail: PLegitCheckDetail): Promise<ILegitCheckDetail> => {
  legitCheckDetail.price = Number(legitCheckDetail.price);
  const response = await celestineApi().post(
    `${TERNARY_ROUTE}`, legitCheckDetail
  );
  return response.data;
}

export const updateLegitCheckDetail = async (
  oldLegitCheckDetail: PLegitCheckDetail,
  newLegitCheckDetail: PLegitCheckDetail,
): Promise<ILegitCheckDetail> => {
  newLegitCheckDetail.price = Number(newLegitCheckDetail.price);
  const response = await celestineApi().patch(
    `${TERNARY_ROUTE}/${oldLegitCheckDetail.id}`, newLegitCheckDetail
  );
  return response.data;
};
