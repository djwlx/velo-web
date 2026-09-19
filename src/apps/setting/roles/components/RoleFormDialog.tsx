import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
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
import { toast } from '@/components/ui/toast';
import type { PermissionInfo } from '@/services/permission/types';
import { createRole, updateRole } from '@/services/role';
import type { RoleDetail, UpdateRolePayload } from '@/services/role/types';
import { RequestError } from '@/utils/request';

const getErrorMessage = (error: unknown) => {
  if (error instanceof RequestError && error.type === 'business') {
    if (error.code === 40002) return '角色标识已存在';
    if (error.code === 10002) return '请检查填写的内容';
    if (error.code === 40001) return '角色不存在';
  }
  return '操作失败，请稍后重试';
};

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: RoleDetail | null;
  permissions: PermissionInfo[];
  onSaved: () => void;
}

export function RoleFormDialog({
  open,
  onOpenChange,
  role,
  permissions,
  onSaved,
}: RoleFormDialogProps) {
  const isEdit = role !== null;

  const schema = useMemo(
    () =>
      z.object({
        code: z
          .string()
          .trim()
          .min(1, '请输入角色标识')
          .max(32, '角色标识不能超过 32 个字符')
          .regex(
            /^[a-z0-9][a-z0-9_-]*$/i,
            '只能包含字母、数字、下划线和连字符'
          ),
        name: z
          .string()
          .trim()
          .min(1, '请输入角色名称')
          .max(64, '角色名称不能超过 64 个字符'),
        permissionCodes: z.array(z.string()),
      }),
    []
  );

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: '', name: '', permissionCodes: [] },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      code: role?.code ?? '',
      name: role?.name ?? '',
      permissionCodes: role?.permissionCodes ?? [],
    });
  }, [open, role, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEdit && role) {
        const payload: UpdateRolePayload = {
          name: values.name,
          permissionCodes: values.permissionCodes,
        };
        await updateRole(role.id, payload);
        toast.add({ type: 'success', title: '保存成功' });
      } else {
        await createRole({
          code: values.code,
          name: values.name,
          permissionCodes: values.permissionCodes,
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
          <DialogTitle>{isEdit ? '编辑角色' : '新增角色'}</DialogTitle>
          <DialogDescription>
            {isEdit ? '修改角色名称与权限。' : '创建一个新的角色并分配权限。'}
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>角色标识</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
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
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>角色名称</FieldLabel>
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
            name="permissionCodes"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldTitle>权限</FieldTitle>
                <div className="flex flex-col gap-2">
                  {permissions.length === 0 ? (
                    <span className="text-sm text-muted-foreground">
                      暂无可用权限
                    </span>
                  ) : (
                    permissions.map((permission) => (
                      <label
                        key={permission.code}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Checkbox
                          className="mt-0.5"
                          checked={field.value.includes(permission.code)}
                          onCheckedChange={(checked) => {
                            field.onChange(
                              checked
                                ? [...field.value, permission.code]
                                : field.value.filter(
                                    (code) => code !== permission.code
                                  )
                            );
                          }}
                        />
                        <span className="flex flex-col">
                          <span>{permission.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {permission.code}
                          </span>
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
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? '保存中…' : '保存'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
