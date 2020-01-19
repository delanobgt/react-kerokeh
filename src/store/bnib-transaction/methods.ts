import celestineApi from "src/apis/celestine";
import { IBnibTransaction } from "./types";
import { PRIMARY_ROUTE } from "./constants";

export const getBnibTransactionByCode = async (code: string): Promise<IBnibTransaction> => {
  const response = await celestineApi().get(`${PRIMARY_ROUTE}/${code}`);
  const transaction: IBnibTransaction = response.data;
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
