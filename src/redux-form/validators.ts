export const requiredValidator = (value: any): any =>
  value || typeof value === "number" ? undefined : "Required";