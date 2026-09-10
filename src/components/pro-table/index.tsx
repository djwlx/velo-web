import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import type { ProTableProps } from './types';

export type { ProTableColumn, ProTableProps } from './types';

export function ProTable<T>(props: ProTableProps<T>) {
  const { className, columns = [], items = [], rowKey, footer } = props;

  return (
    <div
      className={cn(
        'min-h-0 flex-1 overflow-y-auto [&>[data-slot=table-container]]:overflow-visible',
        className
      )}
      role="region"
    >
      <Table>
        <TableHeader className="[&_tr]:border-0">
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  'sticky top-0 z-10 border-b bg-muted',
                  column.className
                )}
              >
                {column.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => {
            const dataRowKey: string | number = rowKey
              ? (item as Record<string, any>)[rowKey]
              : index;

            return (
              <TableRow key={dataRowKey}>
                {columns.map((column) => {
                  const rowCellKey = `${dataRowKey}-${column.key}`;

                  const keyValue = (item as Record<string, any>)[column.key];

                  const cellValue =
                    typeof keyValue === 'string' ? keyValue : null;

                  return (
                    <TableCell key={rowCellKey} className={column.className}>
                      {column.render?.(keyValue, item, index, items) ??
                        cellValue}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {footer}
    </div>
  );
}
