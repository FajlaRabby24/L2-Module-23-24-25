interface IOptions {
  page?: number | string;
  limit?: number | string;
  sortOrder?: string;
  sortBy?: string;
}

export const paginationSortingHelper = (options: IOptions) => {
  console.log(options);
  return options;
};
