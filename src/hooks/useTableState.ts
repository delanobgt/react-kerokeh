import React from "react";
import { ISort } from "src/util/types";

export default function<Filter, Pagination, SortField>(
  initFilter: Filter,
  initPagination: Pagination,
  initSorts: ISort<SortField>[]
) {

  const [filter, setFilter] = React.useState<Filter>(initFilter);
  const [pagination, setPagination] = React.useState<Pagination>(
    initPagination
  );
  const [sorts, setSorts] = React.useState<ISort<SortField>[]>(initSorts);

  const updateFilter = React.useCallback(
    (_filter: Filter) => {
      setFilter({
        ...filter,
        ..._filter
      })
      setPagination(({...pagination, offset: 0}) as unknown as Pagination);
    },
    [filter, pagination]
  );

  const updatePagination = React.useCallback(
    (_pagination: Pagination) => {
      setPagination(({...pagination, ..._pagination}) as unknown as Pagination);
    },
    [pagination]
  );

  const updateSorts = React.useCallback(
    (_sorts: ISort<SortField>[]) => {
      setSorts(_sorts);
    },
    []
  );

  return React.useMemo(() => {
    return {
      filter,
      pagination,
      sorts,
      updateFilter,
      updatePagination,
      updateSorts
    };
  }, [filter, pagination, sorts, updateFilter, updatePagination, updateSorts]);
}
