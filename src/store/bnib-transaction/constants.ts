export const PRIMARY_ROUTE = "/admin/bnib-transaction";

export enum BnibTransactionStatus {
  WaitingPaymentFromBuyer,
  WaitingTrackingCode,
  SellerExpired,
  BuyerExpired,
  ShippingToDepatu,
  ArrivedAtDepatu,
  LegitChecking,
  LegitCheckAuthentic,
  LegitCheckIndefinable,
  LegitCheckFake,
  RefundedByDepatu,
  DisputedByDepatu,
  AcceptedByDepatu,
  DefectProceedApproval,
  DefectReject,
  ShippingToBuyer,
  ArrivedAtBuyer,
  ShippingToSeller,
  ArrivedAtSeller,
  BuyerConfirmation,
  SellerCancel,
  Done
}
