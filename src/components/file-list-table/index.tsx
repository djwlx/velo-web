import { useCallback, useEffect, useRef } from 'react';

import { ProTable } from '../pro-table';
import { FileTableHeader } from './components/TableHeader';

import type { FileListTableProps } from './types';

export type { FileListTableColumn, FileListTableProps } from './types';
export type {
  FileTableBreadcrumbItem,
  FileTableHeaderProps,
} from './components/TableHeader';
export { FileTableHeader } from './components/TableHeader';

export function FileListTable<T>(props: FileListTableProps<T>) {
  const {
    breadcrumbs = [],
    onRefresh,
    onNavigate,
    isLoading = false,
    hasMore = false,
    isLoadingMore = false,
    onLoadMore,
    items,
    ...tableProps
  } = props;

  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(() => {
    if (!hasMore || isLoading || isLoadingMore) return;
    onLoadMore?.();
  }, [hasMore, isLoading, isLoadingMore, onLoadMore]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) handleIntersect();
      },
      { rootMargin: '120px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [handleIntersect]);

  const infiniteFooter = onLoadMore ? (
    <div
      ref={sentinelRef}
      className="text-center text-sm text-muted-foreground"
    >
      {isLoadingMore ? '加载中…' : hasMore ? '滚动加载更多' : ''}
    </div>
  ) : null;

  return (
    <>
      <FileTableHeader
        breadcrumbs={breadcrumbs}
        onRefresh={onRefresh}
        onNavigate={onNavigate}
        isLoading={isLoading}
      />
      <ProTable {...tableProps} items={items} footer={infiniteFooter} />
    </>
  );
}
