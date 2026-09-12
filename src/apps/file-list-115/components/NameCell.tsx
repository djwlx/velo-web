import { TruncatedText } from '@/components/truncated-text';
import { Folder } from 'lucide-react';
import type { ItemsType } from '../types';

export interface NameCellProps {
  item: ItemsType;
  onOpen: () => void;
  onDownload: () => void;
}

export function NameCell({ item, onOpen, onDownload }: NameCellProps) {
  const label = <TruncatedText className="max-w-[50vw]" text={item.name} />;

  if (item.isDir) {
    return (
      <button
        type="button"
        className="inline-flex items-center gap-1.5 text-primary hover:underline"
        onClick={onOpen}
      >
        <Folder className="size-4 shrink-0" />
        {label}
      </button>
    );
  }

  if (!item.pickCode) {
    return label;
  }

  return (
    <button
      type="button"
      className="inline-flex max-w-full items-center text-left hover:underline"
      onClick={onDownload}
    >
      {label}
    </button>
  );
}
