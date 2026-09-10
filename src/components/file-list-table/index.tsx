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
  return (
    <>
      <FileTableHeader breadcrumbs={[]} />
      <ProTable {...props} />
    </>
  );
}
