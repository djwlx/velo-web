import { useCallback, useEffect, useRef, useState } from 'react';
import type { UIEvent } from 'react';
import { RefreshCw } from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileListTable } from '@/components/file-list-table';
import { getFileDownloadUrl, getFileList } from '@/services/pan115';
import type { Pan115FileItem } from '@/services/pan115';

const ROOT_CID = '0';
const PAGE_SIZE = 50;
const SCROLL_THRESHOLD = 80;

type BreadcrumbEntry = { cid: string; name: string };
const ROOT_ENTRY: BreadcrumbEntry = { cid: ROOT_CID, name: '全部文件' };

export function Tools() {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbEntry[]>([
    ROOT_ENTRY,
  ]);
  const [items, setItems] = useState<Pan115FileItem[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const currentFolder = breadcrumbs[breadcrumbs.length - 1] ?? ROOT_ENTRY;
  const hasMore = items.length < total;

  const loadPage = useCallback(
    async (cid: string, nextPage: number, append: boolean) => {
      const currentRequestId = ++requestId.current;
      setError(null);
      if (append) setIsLoadingMore(true);
      else {
        setItems([]);
        setPage(0);
        setTotal(0);
        setIsLoading(true);
      }

      try {
        const response = await getFileList({
          cid,
          page: nextPage,
          pageSize: PAGE_SIZE,
        });
        if (currentRequestId !== requestId.current) return;
        setItems((currentItems) =>
          append
            ? [...currentItems, ...response.data.items]
            : response.data.items
        );
        setPage(response.data.page);
        setTotal(response.data.total);
      } catch {
        if (currentRequestId === requestId.current)
          setError('文件列表加载失败，请稍后重试。');
      } finally {
        if (currentRequestId === requestId.current) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    // Loading is an external side effect; the request function owns its loading state.
    // oxlint-disable-next-line react(set-state-in-effect)
    void loadPage(currentFolder.cid, 1, false);
  }, [currentFolder.cid, loadPage]);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      SCROLL_THRESHOLD;
    if (isNearBottom && hasMore && !isLoading && !isLoadingMore) {
      void loadPage(currentFolder.cid, page + 1, true);
    }
  };

  const openFolder = (item: Pan115FileItem) => {
    if (item.isDirectory)
      setBreadcrumbs((current) => [
        ...current,
        { cid: item.cid, name: item.name },
      ]);
  };

  return (
    <main className="h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <Card className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden">
        <CardHeader className="gap-4 border-b">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <CardTitle className="text-2xl">115 文件</CardTitle>
              <CardDescription>
                浏览云盘文件，滚动到底部自动加载更多内容。
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadPage(currentFolder.cid, 1, false)}
              disabled={isLoading || isLoadingMore}
            >
              <RefreshCw data-icon="inline-start" />
              刷新
            </Button>
          </div>
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((entry, index) => {
                const isCurrent = index === breadcrumbs.length - 1;
                return (
                  <BreadcrumbItem key={`${entry.cid}-${index}`}>
                    {isCurrent ? (
                      <BreadcrumbPage>{entry.name}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        render={<button type="button" />}
                        onClick={() =>
                          setBreadcrumbs((current) =>
                            current.slice(0, index + 1)
                          )
                        }
                      >
                        {entry.name}
                      </BreadcrumbLink>
                    )}
                    {!isCurrent && <BreadcrumbSeparator />}
                  </BreadcrumbItem>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col p-0">
          {error ? (
            <Alert variant="destructive" className="m-6">
              <AlertTitle>加载失败</AlertTitle>
              <AlertDescription className="flex items-center justify-between gap-4">
                <span>{error}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    void loadPage(currentFolder.cid, page || 1, page > 0)
                  }
                >
                  重试
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <FileListTable
              items={items}
              isLoading={isLoading}
              isLoadingMore={isLoadingMore}
              onOpenFolder={openFolder}
              getDownloadUrl={(item) =>
                item.pickCode ? getFileDownloadUrl(item.pickCode) : undefined
              }
              onScroll={handleScroll}
              ariaLabel={`${currentFolder.name}文件列表`}
            />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
