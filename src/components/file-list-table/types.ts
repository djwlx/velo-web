import type { ProTableColumn, ProTableProps } from '../pro-table';
import type { FileTableBreadcrumbItem } from './components/TableHeader';

export interface FileListTableLoadParams {
  cid: string;
  page: number;
  pageSize: number;
}

export interface FileListTableLoadResult<T> {
  items: T[];
  page: number;
  total: number;
}

export interface FileListTableProps<T> extends Pick<
  ProTableProps<T>,
  'className' | 'columns' | 'rowKey'
> {
  breadcrumbs?: FileTableBreadcrumbItem[];
  onNavigate?: (index: number, entry: FileTableBreadcrumbItem) => void;
  loadPage: (
    params: FileListTableLoadParams
  ) => Promise<FileListTableLoadResult<T>>;
  pageSize?: number;
}

export interface FileListTableColumn<T> extends ProTableColumn<T> {}
