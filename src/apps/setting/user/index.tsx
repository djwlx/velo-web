import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/toast';
import { useRequestQuery } from '@/hooks/useRequestQuery';
import { getCurrentUser, updateMe } from '@/services/user';
import { useUser } from '@/stores/user';
import { RequestError } from '@/utils/request';

const userSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(1, '请输入昵称')
    .max(32, '昵称长度不能超过 32 个字符'),
  avatar: z
    .string()
    .trim()
    .max(2048, '头像地址不能超过 2048 个字符')
    .refine(
      (value) => value === '' || /^https?:\/\//.test(value),
      '请输入有效的头像链接'
    ),
});

type UserFormValues = z.infer<typeof userSchema>;

const getErrorMessage = (error: unknown) => {
  if (error instanceof RequestError && error.type === 'business') {
    if (error.code === 10002) return '请检查昵称或头像链接';
    if (error.code === 20002) return '当前密码错误';
  }
  return '保存失败，请稍后重试';
};

export function UserInfo() {
  const { data, loading } = useRequestQuery(getCurrentUser);
  const setUser = useUser((state) => state.setUser);
  const user = data?.data.user;
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { nickname: '', avatar: '' },
  });

  useEffect(() => {
    if (!user) return;
    form.reset({ nickname: user.nickname, avatar: user.avatar ?? '' });
  }, [user, form]);

  const onSubmit = async (values: UserFormValues) => {
    try {
      const response = await updateMe(values);
      setUser(response.data.user);
      form.reset({
        nickname: response.data.user.nickname,
        avatar: response.data.user.avatar ?? '',
      });
      toast.add({ type: 'success', title: '保存成功' });
    } catch (submitError) {
      toast.add({ type: 'error', title: getErrorMessage(submitError) });
    }
  };

  return (
    <main className="flex min-h-0 flex-1 items-start justify-center overflow-auto px-4 py-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>用户信息</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : (
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
            >
              <Field>
                <FieldLabel htmlFor="email">邮箱</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={user?.email ?? ''}
                  disabled
                  readOnly
                />
              </Field>
              <Controller
                name="nickname"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>昵称</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      autoComplete="nickname"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
              <Controller
                name="avatar"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>头像链接</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="url"
                      placeholder="https://"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={
                    form.formState.isSubmitting || !form.formState.isDirty
                  }
                >
                  {form.formState.isSubmitting ? '保存中…' : '保存'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
