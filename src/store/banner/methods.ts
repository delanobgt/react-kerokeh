import celestineApi from "src/apis/celestine";
import { IBanner, PBanner } from "./types";
import { PRIMARY_ROUTE } from "./constants";

export const getBannerById = async (
  id:number
): Promise<IBanner> => {
  const response = await celestineApi().get(`${PRIMARY_ROUTE}/${id}`);
  return response.data;
};

export const createBanner = async (
  banner: PBanner,
  image: any
): Promise<IBanner> => {
  const formData = new FormData();
  formData.append("title", banner.title);
  formData.append("type", String(banner.type));
  formData.append("action", String(banner.action));
  formData.append("action_path", banner.action_path);
  formData.append("is_active", String(Boolean(banner.is_active)));
  formData.append("expired_at", String(banner.expired_at));
  formData.append("image", image);
  const response = await celestineApi().post(PRIMARY_ROUTE, formData);
  return response.data;
};

export const updateBanner = async (
  oldBanner: PBanner,
  newBanner: PBanner,
  image: any
): Promise<IBanner> => {
  const formData = new FormData();
  formData.append("title", newBanner.title);
  formData.append("type", String(newBanner.type));
  formData.append("action", String(newBanner.action));
  formData.append("action_path", newBanner.action_path);
  formData.append("is_active", String(Boolean(newBanner.is_active)));
  formData.append("expired_at", String(newBanner.expired_at));
  if (image) formData.append("image", image);
  const response = await celestineApi().patch(
    `${PRIMARY_ROUTE}/${oldBanner.id}`,
    formData
  );
  return response.data;
};

export const deleteBanner = async (id: number): Promise<void> => {
  await celestineApi().delete(`${PRIMARY_ROUTE}/${id}`);
};
