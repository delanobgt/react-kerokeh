import React from "react";
import useReactRouter from "use-react-router";
import queryString from "query-string";
import { ISort } from "src/util/types";

export default function<Filter, Pagination, SortField>(
  initFilter: Filter,
  initPagination: Pagination,
  initSorts: ISort<SortField>[]
) {
  const { location, history } = useReactRouter();

  const [filter, setFilter] = React.useState<Filter>({} as Filter);
  const [pagination, setPagination] = React.useState<Pagination>(
    {} as Pagination
  );
  const [sorts, setSorts] = React.useState<ISort<SortField>[]>([]);

  React.useEffect(() => {
    const parsed = queryString.parse(location.search);
    const query = queryString.stringify({
      ...initFilter,
      ...initPagination,
      sorts: stringifySorts(initSorts),
      ...parsed
    });
    history.push({ pathname: location.pathname, search: query });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update local state based on location
  React.useEffect(() => {
    const parsed = queryString.parse(location.search);
    const sorts: ISort<SortField>[] = !parsed.sorts
      ? []
      : (parsed.sorts as string).split(",").map(_sort => {
        const [field, dir] = _sort.split(" ");
        return ({
            field,
            dir
          } as unknown) as ISort<SortField>;
        });
    setFilter((parsed as unknown) as Filter);
    setPagination((parsed as unknown) as Pagination);
    setSorts(sorts);
  }, [location]);

  const stringifySorts = React.useCallback((sorts: ISort<SortField>[]) => {
    return sorts.map(sort => `${sort.field} ${sort.dir}`).join(",");
  }, []);

  const updateFilter = React.useCallback(
    (_filter: Filter) => {
      const parsed = queryString.parse(location.search);
      const query = queryString.stringify({
        ...parsed,
        ..._filter
      });
      history.push({ pathname: location.pathname, search: query });
    },
    [location, history]
  );

  const updatePagination = React.useCallback(
    (_pagination: Pagination) => {
    const parsed = queryString.parse(location.search);
      const query = queryString.stringify({
        ...parsed,
        ..._pagination
      });
      history.push({ pathname: location.pathname, search: query });
    },
    [location, history]
  );

  const updateSorts = React.useCallback(
    (_sorts: ISort<SortField>[]) => {
      const parsed = queryString.parse(location.search);
      const query = queryString.stringify({
        ...parsed,
        sorts: stringifySorts(_sorts)
      });
      history.push({ pathname: location.pathname, search: query });
    },
    [location, history, stringifySorts]
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
