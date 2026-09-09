import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { CardHeader } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

export interface FileTableHeaderProps {}

export function FileTableHeader(props: FileTableHeaderProps) {
  return (
    <CardHeader className="gap-4 border-b">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <Button variant="outline" size="sm">
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
                      setBreadcrumbs((current) => current.slice(0, index + 1))
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
  );
}
