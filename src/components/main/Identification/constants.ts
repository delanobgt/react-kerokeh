export const statusLabelDict: Record<
    number,
    { label: string; color: string }
  > = {
      "4": {
        label: "ATTEMPTED",
        color: "orange"
      },
      "2": {
        label: "REJECTED",
        color: "red"
      },
      "1": {
        label: "VERIFIED",
        color: "lightgreen"
      }
    };