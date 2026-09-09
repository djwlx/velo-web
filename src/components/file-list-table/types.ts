import type { ReactNode, UIEventHandler } from 'react';

export interface FileListTableItem {
  cid: string;
  name: string;
  size?: number | string | null;
  isDirectory: boolean;
  pickCode?: string | null;
}

export interface FileListTableColumn<
  T extends FileListTableItem = FileListTableItem,
> {
  key: string;
  title: ReactNode;
  className?: string;
  render?: (item: T) => ReactNode;
}

export interface FileListTableProps<
  T extends FileListTableItem = FileListTableItem,
> {
  items: readonly T[];
  columns?: readonly FileListTableColumn<T>[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  onOpenFolder?: (item: T) => void;
  getDownloadUrl?: (item: T) => string | undefined;
  onScroll?: UIEventHandler<HTMLDivElement>;
  ariaLabel?: string;
  emptyText?: ReactNode;
  className?: string;
}
