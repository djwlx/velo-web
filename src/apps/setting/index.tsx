import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Setting() {
  return (
    <main className="flex min-h-0 flex-1 items-start justify-center overflow-auto px-4 py-6">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>设置</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">设置项即将上线。</p>
        </CardContent>
      </Card>
    </main>
  );
}
