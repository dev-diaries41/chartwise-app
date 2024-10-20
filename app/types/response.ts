export interface APIResponse<T> {
    data: T;
    message?: string;
}

// CRUD Responses
export interface BaseResponse {
    success: boolean;
    message?: string;
}

export interface DataResponse<T> extends BaseResponse {
  data?: T;
}

export interface GetDocsResponse<T = Record<string, any>> extends BaseResponse {
  totalDocuments?: number;
  page?: number;
  perPage?: number;
  data?: T[];
}

export interface GetDocResponse<T> extends DataResponse<T> {}


export interface FindOneAndUpdateResponse<T> extends BaseResponse {
  updatedDoc?: T;
}

export interface AddDocResponse extends BaseResponse {
  id?: string; 
}

export interface AddMultipleDocsResponse extends BaseResponse {
  insertedCount?: number; 
}

export interface DeleteDocResponse extends BaseResponse {}

export interface DeleteDocsResponse extends BaseResponse {}
