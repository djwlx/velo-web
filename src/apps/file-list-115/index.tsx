import {
  FileListTable,
  type FileListTableColumn,
} from '@/components/file-list-table';
import { getFileList } from '@/services/pan115';
import { formatFileSize } from '@/utils/file';
import { useEffect, useState } from 'react';

interface ItemsType {
  name: string;
  size: number;
  isDir: boolean;
  cid?: string;
}

export function FileList115() {
  const [tableItems, setTableItems] = useState<ItemsType[]>([
    {
      name: '哈哈',
      size: 128394,
      isDir: false,
    },
  ]);

  const loadDir = async (cid: string, append?: boolean) => {
    const res = await getFileList({
      cid,
      page: 1,
      pageSize: 50,
    });

    const result = res.data.items.map((item) => {
      return {
        name: item.name,
        isDir: item.isDirectory,
        cid: item.cid,
        size: 0,
      };
    });

    if (append) {
      setTableItems((pre) => [...pre, ...result]);
    } else {
      setTableItems(result);
    }
  };

  const columns: FileListTableColumn<ItemsType>[] = [
    {
      key: 'name',
      title: '名称',
      render: (value: number, item) => {
        return <div onClick={() => loadDir(item.cid as string)}>{value}</div>;
      },
    },
    {
      key: 'size',
      title: '大小',
      render: (value: number) => {
        return formatFileSize(value);
      },
    },
  ];

  useEffect(() => {
    // loadDir('0');
  }, []);

  return <FileListTable columns={columns} items={tableItems} />;
}
