import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { Link, Redirect, useLocation, useSearchParams } from 'wouter';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { useUser } from '@/stores/user';
import { RequestError } from '@/utils/request';

const authSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, '请输入邮箱')
    .email('请输入有效的邮箱')
    .max(320, '邮箱长度不能超过 320 个字符'),
  password: z
    .string()
    .min(4, '密码长度需要在 4 到 256 个字符之间')
    .max(256, '密码长度需要在 4 到 256 个字符之间'),
});

type AuthFormValues = z.infer<typeof authSchema>;

const getErrorMessage = (error: unknown) => {
  if (error instanceof RequestError && error.type === 'business') {
    if (error.code === 20002) return '邮箱或密码错误';
    if (error.code === 40002) return '该邮箱已注册';
    if (error.code === 10002) return '请输入有效的邮箱和密码';
  }
  return '操作失败，请稍后重试';
};

export function AuthPage() {
  const [location, navigate] = useLocation();
  const [searchParams] = useSearchParams();
  const user = useUser((state) => state.user);
  const signIn = useUser((state) => state.signIn);
  const signUp = useUser((state) => state.signUp);
  const isRegister = location === '/register';
  const redirectParam = searchParams.get('redirect');
  const redirectTo =
    redirectParam &&
    redirectParam.startsWith('/') &&
    !redirectParam.startsWith('//')
      ? redirectParam
      : '/';
  const authSwitchHref = `${isRegister ? '/login' : '/register'}${
    redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ''
  }`;
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: '', password: '' },
  });

  if (user) return <Redirect to={redirectTo} />;

  const onSubmit = async ({ email, password }: AuthFormValues) => {
    try {
      if (isRegister) await signUp(email, password);
      else await signIn(email, password);
      toast.add({
        type: 'success',
        title: isRegister ? '注册成功' : '登录成功',
      });
      navigate(redirectTo);
    } catch (submitError) {
      toast.add({ type: 'error', title: getErrorMessage(submitError) });
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{isRegister ? '注册 Velo' : '登录 Velo'}</CardTitle>
          <CardDescription>
            {isRegister ? '创建账号后即可开始使用。' : '登录后继续使用 Velo。'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>邮箱</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>密码</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    autoComplete={
                      isRegister ? 'new-password' : 'current-password'
                    }
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? '提交中…'
                : isRegister
                  ? '注册'
                  : '登录'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          {isRegister ? '已有账号？' : '还没有账号？'}
          <Link
            className="ml-1 text-primary hover:underline"
            href={authSwitchHref}
          >
            {isRegister ? '去登录' : '去注册'}
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
