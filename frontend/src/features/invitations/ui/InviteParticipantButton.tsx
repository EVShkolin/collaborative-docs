import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus } from 'lucide-react';
import { z } from 'zod';
import { isAxiosError } from 'axios';

import { Button } from '@/shared/ui/button.tsx';
import { Input } from '@/shared/ui/input.tsx';
import { Label } from '@/shared/ui/label.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select.tsx';
import { useSendInvitation } from '@/entities/invitation/api/queries';

const inviteSchema = z.object({
  email: z.email('Некорректный email'),
  role: z.enum(['viewer', 'commenter', 'editor']),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

const ROLE_OPTIONS: Array<{
  value: InviteFormValues['role'];
  label: string;
  description: string;
}> = [
  { value: 'viewer', label: 'Читатель', description: 'Просмотр без изменений' },
  { value: 'commenter', label: 'Комментатор', description: 'Просмотр и комментарии' },
  { value: 'editor', label: 'Редактор', description: 'Полное редактирование' },
];

export const InviteParticipantButton = ({ documentId }: { documentId: string }) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useSendInvitation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: '', role: 'viewer' },
  });

  const handleOpenChange = (next: boolean) => {
    if (isPending) return;
    setOpen(next);
    if (!next) reset();
  };

  const onSubmit = (values: InviteFormValues) => {
    mutate(
      {
        invitedUserEmail: values.email,
        documentId,
        role: values.role,
      },
      {
        onSuccess: () => handleOpenChange(false),
        onError: (error) => {
          const status = isAxiosError(error) ? error.response?.status : undefined;

          if (status === 404) {
            setError('email', {
              type: 'server',
              message: 'Пользователь с таким email не существует',
            });
            return;
          }

          if (status === 409) {
            setError('email', {
              type: 'server',
              message: 'Этот пользователь уже участник документа',
            });
            return;
          }

          setError('email', {
            type: 'server',
            message: 'Не удалось отправить приглашение, попробуйте ещё раз',
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="outline" className="mt-3 w-full">
            <Plus />
            Пригласить
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Пригласить в документ</DialogTitle>
          <DialogDescription>
            Пользователь получит уведомление и сможет принять или отклонить приглашение.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="user@example.com"
              autoComplete="email"
              disabled={isPending}
              aria-invalid={!!errors.email}
              {...register('email')}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="invite-role">Роль</Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isPending} items={ROLE_OPTIONS}>
                  <SelectTrigger id="invite-role" className="w-full">
                    <SelectValue placeholder="Выберите роль" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex flex-col">
                          <span>{opt.label}</span>
                          <span className="text-xs text-muted-foreground">{opt.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
          </div>

          <DialogFooter className="mt-5">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
              Отмена
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Отправить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
