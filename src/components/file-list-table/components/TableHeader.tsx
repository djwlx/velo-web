import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

export interface FileTableBreadcrumbItem {
  cid: string;
  name: string;
}

export interface FileTableHeaderProps {
  breadcrumbs: FileTableBreadcrumbItem[];
  onRefresh?: () => void;
  onNavigate?: (index: number, entry: FileTableBreadcrumbItem) => void;
  isLoading?: boolean;
  className?: string;
}

export function FileTableHeader({
  breadcrumbs,
  onRefresh,
  onNavigate,
  isLoading = false,
  className,
}: FileTableHeaderProps) {
  return (
    <CardHeader className={cn('gap-4 border-b', className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
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
                    onClick={() => onNavigate?.(index, entry)}
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
  );
}
