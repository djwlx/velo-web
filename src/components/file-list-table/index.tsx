import { useCallback, useEffect, useRef, useState } from 'react';

import { ProTable } from '../pro-table';
import { FileTableHeader } from './components/TableHeader';

import type { FileListTableProps } from './types';

export type {
  FileListTableColumn,
  FileListTableLoadParams,
  FileListTableLoadResult,
  FileListTableProps,
} from './types';
export type {
  FileTableBreadcrumbItem,
  FileTableHeaderProps,
} from './components/TableHeader';
export { FileTableHeader } from './components/TableHeader';

const DEFAULT_PAGE_SIZE = 50;

export function FileListTable<T>(props: FileListTableProps<T>) {
  const {
    breadcrumbs = [],
    onNavigate,
    columns,
    rowKey,
    className,
    loadPage,
    pageSize = DEFAULT_PAGE_SIZE,
  } = props;

  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const requestId = useRef(0);

  const currentCid = breadcrumbs[breadcrumbs.length - 1]?.cid ?? '0';
  const hasMore = items.length < total;

  const fetchPage = useCallback(
    async (cid: string, nextPage: number, append: boolean) => {
      const currentRequestId = ++requestId.current;

      if (append) {
        setIsLoadingMore(true);
      } else {
        setItems([]);
        setPage(1);
        setTotal(0);
        setIsLoading(true);
      }

      try {
        const result = await loadPage({ cid, page: nextPage, pageSize });
        if (currentRequestId !== requestId.current) return;

        setItems((prev) =>
          append ? [...prev, ...result.items] : result.items
        );
        setPage(result.page);
        setTotal(result.total);
      } finally {
        if (currentRequestId === requestId.current) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [loadPage, pageSize]
  );

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    void fetchPage(currentCid, 1, false);
  }, [currentCid, fetchPage]);

  const loadMore = useCallback(() => {
    void fetchPage(currentCid, page + 1, true);
  }, [fetchPage, currentCid, page]);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(() => {
    if (!hasMore || isLoading || isLoadingMore) return;
    loadMore();
  }, [hasMore, isLoading, isLoadingMore, loadMore]);

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

  const infiniteFooter = (
    <div
      ref={sentinelRef}
      className="text-center text-sm text-muted-foreground"
    >
      {isLoadingMore ? '加载中…' : hasMore ? '滚动加载更多' : ''}
    </div>
  );

  return (
    <>
      <FileTableHeader
        breadcrumbs={breadcrumbs}
        onRefresh={() => void fetchPage(currentCid, 1, false)}
        onNavigate={onNavigate}
        isLoading={isLoading}
      />
      <ProTable
        className={className}
        columns={columns}
        rowKey={rowKey}
        items={items}
        isLoading={isLoading}
        footer={infiniteFooter}
      />
    </>
  );
}
