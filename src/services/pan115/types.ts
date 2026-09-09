export interface Pan115FileItem {
  cid: string;
  name: string;
  pickCode: string | null;
  isDirectory: boolean;
  type: string | null;
}

export interface Pan115FileList {
  cid: string;
  page: number;
  pageSize: number;
  total: number;
  items: Pan115FileItem[];
}

export interface GetPan115FilesParams {
  cid: string;
  page?: number;
  pageSize?: number;
}
