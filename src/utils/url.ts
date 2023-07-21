interface FiltersParams {
  [k: string]: string;
}

interface SortParams {
  [k: string]: string;
}

interface PaginationParams {
  [k: string]: string;
}

export type getUrlWithQueryParamsConfig =
  | {
      filters?: FiltersParams;
      sort?: SortParams;
      pagination?: PaginationParams;
    }
  | undefined;

type getUrlWithQueryParamsFn = (
  path: string,
  config: getUrlWithQueryParamsConfig
) => string;

export const getUrlWithQueryParams: getUrlWithQueryParamsFn = function (
  path,
  config
) {
  const { filters, sort, pagination } = config || {};
  const queryParams = new URLSearchParams({
    ...(filters || {}),
    ...(sort || {}),
    ...(pagination || {}),
  }).toString();

  return queryParams ? `${path}?${queryParams}` : path;
};
