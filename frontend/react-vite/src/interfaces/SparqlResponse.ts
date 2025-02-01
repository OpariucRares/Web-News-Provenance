export interface SparqlResponse<T> {
  content: T;
  message: string;
  statusCode: number;
}
