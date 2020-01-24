import React from "react";

interface IComponentProps {
  placeholder?: string;
  onChange?: (e: string) => void;
}

export const makeRangeFilterUI = ({
  placeholder,
  onChange
}: IComponentProps) => ({ column }: { column: any }) => {
  const { filterValue = [], preFilteredRows, setFilter, id } = column;
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row: any) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <div
      style={{
        display: "flex"
      }}
    >
      <input
        value={filterValue[0] || ""}
        type="number"
        onChange={e => {
          const val = e.target.value;
          setFilter((old: any = []) => [
            val ? parseInt(val, 10) : undefined,
            old[1]
          ]);
          onChange(e.target.value);
        }}
        placeholder={`Min (${min})`}
        style={{
          width: "70px",
          marginRight: "0.5rem"
        }}
      />
      to
      <input
        value={filterValue[1] || ""}
        type="number"
        onChange={e => {
          const val = e.target.value;
          setFilter((old: any = []) => [
            old[0],
            val ? parseInt(val, 10) : undefined
          ]);
          onChange(e.target.value || undefined);
        }}
        placeholder={`Max (${max})`}
        style={{
          width: "70px",
          marginLeft: "0.5rem"
        }}
      />
    </div>
  );
};

export const rangeFilter = "between";
