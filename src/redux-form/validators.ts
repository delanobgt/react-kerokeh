export const requiredValidator = (value: any): any => 
  value || typeof value === "number" ? undefined : "Required";

export const realNumberValidator = (value: any): any => 
  (/^\d+(\.\d+)?$/).test(value) ? undefined : "Invalid Real Number Format";
  