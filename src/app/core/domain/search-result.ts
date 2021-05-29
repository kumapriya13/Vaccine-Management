export interface ISearchResult {
  resultMetadata: {
    count: number;
    page: number;
    pageLength: number;
    sort: string;
  };
  results: any[];
}
