import {
  FileListTable,
  type FileListTableColumn,
} from '@/components/file-list-table';
import { Card } from '@/components/ui/card';
import { getFileList } from '@/services/pan115';
import { formatFileSize } from '@/utils/file';
import { useCallback, useEffect, useRef, useState } from 'react';

const PAGE_SIZE = 50;

interface BreadcrumbEntry {
  cid: string;
  name: string;
}

interface ItemsType {
  name: string;
  size: number;
  isDir: boolean;
  cid?: string;
}

const ROOT_ENTRY: BreadcrumbEntry = { cid: '0', name: '全部文件' };

export function FileList115() {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbEntry[]>([
    ROOT_ENTRY,
  ]);
  const [tableItems, setTableItems] = useState<ItemsType[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const requestId = useRef(0);

  const currentFolder = breadcrumbs[breadcrumbs.length - 1] ?? ROOT_ENTRY;
  const hasMore = tableItems.length < total;

  const loadPage = useCallback(
    async (cid: string, nextPage: number, append: boolean) => {
      const currentRequestId = ++requestId.current;

      if (append) {
        setIsLoadingMore(true);
      } else {
        setTableItems([]);
        setPage(1);
        setTotal(0);
        setIsLoading(true);
      }

      try {
        const res = await getFileList({
          cid,
          page: nextPage,
          pageSize: PAGE_SIZE,
        });
        if (currentRequestId !== requestId.current) return;

        const result: ItemsType[] = res.data.items.map((item) => ({
          name: item.name,
          isDir: item.isDirectory,
          cid: item.cid,
          size: item.size,
        }));

        setTableItems((pre) => (append ? [...pre, ...result] : result));
        setPage(res.data.page);
        setTotal(res.data.total);
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
    // oxlint-disable-next-line react/set-state-in-effect
    void loadPage(currentFolder.cid, 1, false);
  }, [currentFolder.cid, loadPage]);

  const loadMore = useCallback(() => {
    void loadPage(currentFolder.cid, page + 1, true);
  }, [loadPage, currentFolder.cid, page]);

  const columns: FileListTableColumn<ItemsType>[] = [
    {
      key: 'name',
      title: '名称',
      render: (_value, item) =>
        item.isDir ? (
          <button
            type="button"
            className="text-primary hover:underline"
            onClick={() =>
              setBreadcrumbs((current) => [
                ...current,
                { cid: item.cid ?? '0', name: item.name },
              ])
            }
          >
            {item.name}
          </button>
        ) : (
          <span>{item.name}</span>
        ),
    },
    {
      key: 'size',
      title: '大小',
      render: (_value, item) => {
        if (!_value) {
          return '-';
        }

        return formatFileSize(item.size);
      },
    },
  ];

  return (
    <main className="max-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <Card className="mx-auto flex max-h-[calc(100vh-4rem)] max-w-6xl flex-col gap-0 overflow-hidden">
        <FileListTable
          columns={columns}
          items={tableItems}
          breadcrumbs={breadcrumbs}
          isLoading={isLoading}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={loadMore}
          onRefresh={() => loadPage(currentFolder.cid, 1, false)}
          onNavigate={(index) =>
            setBreadcrumbs((current) => current.slice(0, index + 1))
          }
        />
      </Card>
    </main>
  );
}
