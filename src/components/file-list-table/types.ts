import type { ProTableProps, ProTableColumn } from '../pro-table';
import type { FileTableBreadcrumbItem } from './components/TableHeader';

export interface FileListTableProps<T> extends ProTableProps<T> {
  breadcrumbs?: FileTableBreadcrumbItem[];
  onRefresh?: () => void;
  onNavigate?: (index: number, entry: FileTableBreadcrumbItem) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
}

export interface FileListTableColumn<T> extends ProTableColumn<T> {}
