import {
  FileListTable,
  type FileListTableColumn,
  type FileListTableLoadParams,
} from '@/components/file-list-table';
import { Card } from '@/components/ui/card';
import { getFileList } from '@/services/pan115';
import { formatFileSize } from '@/utils/file';
import { Folder } from 'lucide-react';
import { useCallback, useState } from 'react';
import type { BreadcrumbEntry, ItemsType } from './types';

const PAGE_SIZE = 50;

const ROOT_ENTRY: BreadcrumbEntry = { cid: '0', name: '全部文件' };

export function FileList115() {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbEntry[]>([
    ROOT_ENTRY,
  ]);

  const loadPage = useCallback(
    async ({ cid, page, pageSize }: FileListTableLoadParams) => {
      const res = await getFileList({ cid, page, pageSize });

      return {
        items: res.data.items.map<ItemsType>((item) => ({
          name: item.name,
          isDir: item.isDirectory,
          cid: item.cid,
          size: item.size,
        })),
        page: res.data.page,
        total: res.data.total,
      };
    },
    []
  );

  const columns: FileListTableColumn<ItemsType>[] = [
    {
      key: 'name',
      title: '名称',
      render: (_value, item) =>
        item.isDir ? (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-primary hover:underline"
            onClick={() =>
              setBreadcrumbs((current) => [
                ...current,
                { cid: item.cid ?? '0', name: item.name },
              ])
            }
          >
            <Folder className="size-4 shrink-0" />
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
          breadcrumbs={breadcrumbs}
          loadPage={loadPage}
          pageSize={PAGE_SIZE}
          onNavigate={(index) =>
            setBreadcrumbs((current) => current.slice(0, index + 1))
          }
        />
      </Card>
    </main>
  );
}
