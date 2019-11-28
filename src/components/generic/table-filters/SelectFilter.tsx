import React from "react";

export const makeSelectFilterUI = () => ({ column }: { column: any }) => {
  // Calculate the options for filtering
  // using the preFilteredRows
  const { filterValue, setFilter, preFilteredRows, id } = column;
  const options = React.useMemo((): any => {
    const options = new Set<any>();
    preFilteredRows.forEach((row: any) => {
      options.add(row.values[id]);
    });
    return Array.from(options.values());
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option: any, i: number) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export const selectFilter = "equal";
