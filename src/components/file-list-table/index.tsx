import { ChevronRight, File, FolderOpen, LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/utils/file';
import type {
  FileListTableColumn,
  FileListTableItem,
  FileListTableProps,
} from './types';

export type {
  FileListTableColumn,
  FileListTableItem,
  FileListTableProps,
} from './types';

export function FileListTable<T extends FileListTableItem>({
  items,
  columns = [],
  isLoading = false,
  isLoadingMore = false,
  onOpenFolder,
  getDownloadUrl,
  onScroll,
  ariaLabel = '文件列表',
  emptyText = '此目录暂无文件',
  className,
}: FileListTableProps<T>) {
  const defaultColumns: FileListTableColumn<T>[] = [
    {
      key: 'name',
      title: 'Name',
      render: (item) => {
        if (item.isDirectory && onOpenFolder) {
          return (
            <Button
              variant="ghost"
              className="h-auto max-w-full justify-start px-2 py-1 text-primary"
              onClick={() => onOpenFolder(item)}
            >
              <FolderOpen data-icon="inline-start" />
              <span className="truncate">{item.name}</span>
              <ChevronRight data-icon="inline-end" />
            </Button>
          );
        }

        const downloadUrl = getDownloadUrl?.(item);
        return (
          <div className="flex min-w-0 items-center gap-2 px-2">
            <File className="shrink-0 text-muted-foreground" />
            {downloadUrl ? (
              <a
                className="truncate text-primary underline-offset-4 hover:underline"
                href={downloadUrl}
                download
              >
                {item.name}
              </a>
            ) : (
              <span className="truncate">{item.name}</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'size',
      title: 'Size',
      className: 'w-36',
      render: (item) => formatFileSize(item.size),
    },
  ];
  const visibleColumns = columns.length > 0 ? [...columns] : defaultColumns;

  return (
    <div
      className={cn('min-h-0 flex-1 overflow-y-auto', className)}
      onScroll={onScroll}
      role="region"
      aria-label={ariaLabel}
    >
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            {visibleColumns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 8 }, (_, index) => (
              <TableRow key={`loading-${index}`}>
                <TableCell colSpan={visibleColumns.length}>
                  <Skeleton className="h-5 w-3/4" />
                </TableCell>
              </TableRow>
            ))
          ) : items.length > 0 ? (
            items.map((item) => (
              <TableRow key={`${item.cid}-${item.pickCode ?? item.name}`}>
                {visibleColumns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {column.render?.(item) ?? null}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={visibleColumns.length}
                className="h-32 text-center text-muted-foreground"
              >
                {emptyText}
              </TableCell>
            </TableRow>
          )}
          {isLoadingMore && (
            <TableRow>
              <TableCell
                colSpan={visibleColumns.length}
                className="text-center text-muted-foreground"
              >
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle className="animate-spin" />
                  正在加载更多…
                </span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
