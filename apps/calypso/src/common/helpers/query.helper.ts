import { Injectable } from '@nestjs/common';

@Injectable()
export class QueryHelper {
  skipHelper = (pageNumber: number, pageSize: number) => {
    return (pageNumber - 1) * pageSize;
  };

  pagesCountHelper = (totalCount: number, pageSize: number) => {
    return Math.ceil(totalCount / pageSize);
  };

  queryParamHelper = (queryParam) => {
    const sortBy =
      queryParam.sortBy === '' || queryParam.sortBy === undefined
        ? 'createdAt'
        : queryParam.sortBy;
    const sortDirection =
      queryParam.sortDirection === '' || queryParam.sortDirection === undefined
        ? 'desc'
        : queryParam.sortDirection;
    const pageNumber =
      queryParam.pageNumber <= 0 || queryParam.pageNumber === undefined
        ? 1
        : +queryParam.pageNumber;
    const pageSize =
      queryParam.pageSize <= 0 || queryParam.pageSize === undefined
        ? 9
        : +queryParam.pageSize;
    return { sortBy, sortDirection, pageSize, pageNumber };
  };
}
