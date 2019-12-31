import celestineApi from "src/apis/celestine";
import { IPromoCode, PPromoCode } from "./types";

export const createPromoCode = async (
  promoCode: PPromoCode,
  image: any
): Promise<IPromoCode> => {
  const formData = new FormData();
  formData.append("active_status", String(promoCode.active_status));
  formData.append("code", promoCode.code);
  formData.append("expired_at", promoCode.expired_at);
  formData.append("percentage", String(promoCode.percentage));
  formData.append("product_type", promoCode.product_type);
  formData.append("limit", String(promoCode.limit));
  if (typeof promoCode.description === "string")
    formData.append("description", promoCode.description);
  formData.append("image", image);
  const response = await celestineApi().post(`/admin/promo-code`, formData);
  return response.data;
};

export const updatePromoCode = async (
  oldPromoCode: PPromoCode,
  newPromoCode: PPromoCode,
  image: any
): Promise<IPromoCode> => {
  const formData = new FormData();
  if (oldPromoCode.code !== newPromoCode.code)
    formData.append("code", newPromoCode.code);
  formData.append("active_status", String(newPromoCode.active_status));
  formData.append("expired_at", newPromoCode.expired_at);
  formData.append("percentage", String(newPromoCode.percentage));
  formData.append("product_type", newPromoCode.product_type);
  formData.append("limit", String(newPromoCode.limit));
  if (typeof newPromoCode.description === "string")
    formData.append("description", newPromoCode.description);
  if (image) formData.append("image", image);
  const response = await celestineApi().patch(
    `/admin/promo-code/${oldPromoCode.id}`,
    formData
  );
  return response.data;
};

export const deletePromoCode = async (id: number): Promise<void> => {
  await celestineApi().delete(`/admin/promo-code/${id}`);
};
