import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRequestQuery } from '@/hooks/useRequestQuery';
import { getVersion } from '@/services/config';
import { FileText, Image } from 'lucide-react';
import { Link } from 'wouter';

const entries = [
  {
    href: '/115',
    title: '115 文件',
    description: '浏览网盘文件',
    icon: FileText,
  },
  {
    href: '/pic',
    title: '随机图片',
    description: '随机看一张图',
    icon: Image,
  },
];

export function Home() {
  const { data } = useRequestQuery(getVersion);
  const version = data?.data.version;

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-4 py-12">
      <div className="flex items-baseline gap-2">
        <h1 className="font-heading text-2xl font-medium">Velo</h1>
        {version ? (
          <span className="text-xs text-muted-foreground">v{version}</span>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {entries.map((entry) => (
          <Link key={entry.href} href={entry.href} className="block">
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <entry.icon className="size-5 text-muted-foreground" />
                  <div className="flex flex-col gap-0.5">
                    <CardTitle>{entry.title}</CardTitle>
                    <CardDescription>{entry.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
