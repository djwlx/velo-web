import {
  FileListTable,
  type FileListTableColumn,
  type FileListTableLoadParams,
} from '@/components/file-list-table';
import { Card } from '@/components/ui/card';
import { getFileList } from '@/services/pan115';
import { formatFileSize } from '@/utils/file';
import { Folder } from 'lucide-react';
import { useCallback } from 'react';
import { useSearchParams } from 'wouter';
import type { ItemsType } from './types';
import { CID_PARAM, PAGE_SIZE, ROOT_ENTRY, toBreadcrumbs } from './utils';

export function FileList115() {
  const [searchParams, setSearchParams] = useSearchParams();

  const cid = searchParams.get(CID_PARAM) ?? ROOT_ENTRY.cid;

  const navigate = useCallback(
    (nextCid: string) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (nextCid === ROOT_ENTRY.cid) {
          params.delete(CID_PARAM);
        } else {
          params.set(CID_PARAM, nextCid);
        }
        return params;
      });
    },
    [setSearchParams]
  );

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
        path: toBreadcrumbs(res.data.path),
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
            onClick={() => navigate(item.cid ?? ROOT_ENTRY.cid)}
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
          cid={cid}
          columns={columns}
          loadPage={loadPage}
          pageSize={PAGE_SIZE}
          onNavigate={(entry) => navigate(entry.cid)}
        />
      </Card>
    </main>
  );
}
