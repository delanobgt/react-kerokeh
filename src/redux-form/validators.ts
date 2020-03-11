export const requiredValidator = (value: any): any =>
  value || typeof value === "number" ? undefined : "Required";

export const realNumberValidator = (value: any): any =>
  /^-?\d+(\.\d+)?$/.test(value) ? undefined : "Invalid Real Number Format";

export const unsignedRealNumberValidator = (value: any): any =>
  /^\d+(\.\d+)?$/.test(value) ? undefined : "Invalid Real Number Format";

export const wholeNumberValidator = (value: any): any =>
  /^-?\d+$/.test(value) ? undefined : "Invalid Whole Number Format";

export const unsignedWholeNumberValidator = (value: any): any =>
  /^\d+$/.test(value) ? undefined : "Invalid Whole Number Format";

export const nonZeroWholeNumberValidator = (value: any): any =>
  value === "0"
    ? "Cannot be zero"
    : /^-?\d+$/.test(value)
    ? undefined
    : "Invalid Whole Number Format";
