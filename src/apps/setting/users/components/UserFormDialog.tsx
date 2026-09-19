import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Field,
  FieldError,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/toast';
import { useRequestQuery } from '@/hooks/useRequestQuery';
import type { RoleDetail } from '@/services/role/types';
import { createUser, getUser, updateUser } from '@/services/user';
import type { UpdateUserPayload } from '@/services/user/types';
import { RequestError } from '@/utils/request';

const STATUS_ITEMS = { active: '启用', disabled: '禁用' } as const;

const getErrorMessage = (error: unknown) => {
  if (error instanceof RequestError && error.type === 'business') {
    if (error.code === 40002) return '该邮箱已被使用';
    if (error.code === 10002) return '请检查填写的内容';
    if (error.code === 40001) return '用户不存在';
  }
  return '操作失败，请稍后重试';
};

const nicknameField = z
  .string()
  .trim()
  .min(1, '请输入昵称')
  .max(32, '昵称长度不能超过 32 个字符');

const avatarField = z
  .string()
  .trim()
  .max(2048, '头像地址不能超过 2048 个字符')
  .refine(
    (value) => value === '' || /^https?:\/\//.test(value),
    '请输入有效的头像链接'
  );

const optionalPasswordField = z
  .string()
  .max(256, '密码长度需要在 4 到 256 个字符之间')
  .refine(
    (value) => value === '' || (value.length >= 4 && value.length <= 256),
    '密码长度需要在 4 到 256 个字符之间'
  );

const requiredPasswordField = z
  .string()
  .min(4, '密码长度需要在 4 到 256 个字符之间')
  .max(256, '密码长度需要在 4 到 256 个字符之间');

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number | null;
  roles: RoleDetail[];
  onSaved: () => void;
}

export function UserFormDialog({
  open,
  onOpenChange,
  userId,
  roles,
  onSaved,
}: UserFormDialogProps) {
  const isEdit = userId !== null;
  const fetchUser = useCallback(() => getUser(userId as number), [userId]);
  const { data, loading } = useRequestQuery(fetchUser, {
    enabled: open && isEdit,
  });

  const schema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .trim()
          .min(1, '请输入邮箱')
          .email('请输入有效的邮箱')
          .max(320, '邮箱长度不能超过 320 个字符'),
        password: isEdit ? optionalPasswordField : requiredPasswordField,
        nickname: nicknameField,
        avatar: avatarField,
        status: z.enum(['active', 'disabled']),
        roleIds: z.array(z.number()),
      }),
    [isEdit]
  );

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      nickname: '',
      avatar: '',
      status: 'active',
      roleIds: [],
    },
  });

  useEffect(() => {
    if (!open) return;
    const user = data?.data.user;
    if (isEdit && !user) return;
    form.reset({
      email: user?.email ?? '',
      password: '',
      nickname: user?.nickname ?? '',
      avatar: user?.avatar ?? '',
      status: user?.status ?? 'active',
      roleIds: user?.roleIds ?? [],
    });
  }, [open, isEdit, data, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEdit && userId !== null) {
        const payload: UpdateUserPayload = {
          nickname: values.nickname,
          avatar: values.avatar,
          status: values.status,
          roleIds: values.roleIds,
        };
        if (values.password) payload.password = values.password;
        await updateUser(userId, payload);
        toast.add({ type: 'success', title: '保存成功' });
      } else {
        await createUser({
          email: values.email,
          password: values.password,
          nickname: values.nickname,
          avatar: values.avatar,
          status: values.status,
          roleIds: values.roleIds,
        });
        toast.add({ type: 'success', title: '创建成功' });
      }
      onSaved();
      onOpenChange(false);
    } catch (error) {
      toast.add({ type: 'error', title: getErrorMessage(error) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? '编辑用户' : '新增用户'}</DialogTitle>
          <DialogDescription>
            {isEdit ? '修改用户资料、状态与角色。' : '创建一个新的用户账号。'}
          </DialogDescription>
        </DialogHeader>
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
                  autoComplete="off"
                  disabled={isEdit}
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
                  autoComplete="new-password"
                  placeholder={isEdit ? '留空则不修改' : undefined}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />
          <Controller
            name="nickname"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>昵称</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  autoComplete="off"
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
          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="status">状态</FieldLabel>
                <Select
                  items={STATUS_ITEMS}
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">启用</SelectItem>
                    <SelectItem value="disabled">禁用</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          <Controller
            name="roleIds"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldTitle>角色</FieldTitle>
                <div className="flex flex-col gap-2">
                  {roles.length === 0 ? (
                    <span className="text-sm text-muted-foreground">
                      暂无可用角色
                    </span>
                  ) : (
                    roles.map((role) => (
                      <label
                        key={role.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Checkbox
                          checked={field.value.includes(role.id)}
                          onCheckedChange={(checked) => {
                            field.onChange(
                              checked
                                ? [...field.value, role.id]
                                : field.value.filter((id) => id !== role.id)
                            );
                          }}
                        />
                        <span>{role.name}</span>
                        <span className="text-muted-foreground">
                          {role.code}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </Field>
            )}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || loading}
            >
              {form.formState.isSubmitting ? '保存中…' : '保存'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
