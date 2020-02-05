import moment from "moment";
import celestineApi from "src/apis/celestine";
import { IProduct, PProduct } from "./types";
import { PRIMARY_ROUTE } from "./constants";

export const getProductById = async (id: number): Promise<IProduct> => {
  const response = await celestineApi().get(`${PRIMARY_ROUTE}/${id}`);
  const product: IProduct = response.data;
  product.detail_image_urls = Boolean(product.detail_image_url)
    ? product.detail_image_url.split(",")
    : [];
  return product;
};

export const createProduct = async (
  product: PProduct,
  product_brand_id: number,
  product_category_id: number,
  display_image: any,
  detail_images: any[]
): Promise<IProduct> => {
  const formData = new FormData();
  formData.append("name", product.name);
  formData.append("slug", product.slug);
  formData.append("code", product.code);
  formData.append("color", product.color);
  formData.append("description", product.description);
  formData.append("story", product.story);
  formData.append("is_active", String(product.is_active));
  formData.append("gender", String(product.gender));
  if (product.release_date)
    formData.append(
      "release_date",
      moment(product.release_date).format("YYYY-MM-DD")
    );

  formData.append("product_brand_id", String(product_brand_id));
  formData.append("product_category_id", String(product_category_id));
  formData.append("display_image", display_image);
  for (let image of detail_images) formData.append("detail_images[]", image);
  const response = await celestineApi().post(PRIMARY_ROUTE, formData);
  return response.data;
};

export const updateProduct = async (
  oldProduct: PProduct,
  newProduct: PProduct,
  product_brand_id: number,
  product_category_id: number,
  display_image: any,
  detail_images: any[],
  initial_detail_images: { image_path: string; deleted: boolean }[]
): Promise<void> => {
  const formData = new FormData();
  if (oldProduct.name !== newProduct.name)
    formData.append("name", newProduct.name);
  if (oldProduct.slug !== newProduct.slug)
    formData.append("slug", newProduct.slug);
  if (oldProduct.code !== newProduct.code)
    formData.append("code", newProduct.code);
  formData.append("description", newProduct.description);
  formData.append("story", newProduct.story);
  formData.append("is_active", String(newProduct.is_active));
  formData.append("gender", String(newProduct.gender));
  formData.append("color", String(newProduct.color));
  if (newProduct.release_date)
    formData.append(
      "release_date",
      moment(newProduct.release_date).format("YYYY-MM-DD")
    );
  formData.append("product_brand_id", String(product_brand_id));
  formData.append("product_category_id", String(product_category_id));
  if (display_image) formData.append("new_display_image", display_image);
  if (detail_images) {
    for (let image of detail_images)
      formData.append("new_detail_images[]", image);
  }
  const deleted_detail_images = initial_detail_images
    .filter(img => img.deleted)
    .map(img => img.image_path)
    .join(",");
  if (Boolean(deleted_detail_images))
    formData.append("deleted_detail_images", deleted_detail_images);

  const response = await celestineApi().patch(
    `${PRIMARY_ROUTE}/${oldProduct.id}`,
    formData
  );
  console.log(response.data);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<IProduct> => {
  const response = await celestineApi().delete(`${PRIMARY_ROUTE}/${id}`);
  return response.data;
};
