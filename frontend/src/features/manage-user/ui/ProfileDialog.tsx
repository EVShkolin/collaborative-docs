import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog.tsx';
import { Button } from '@/shared/ui/button.tsx';
import { Input } from '@/shared/ui/input.tsx';
import { Label } from '@/shared/ui/label.tsx';
import { useCurrentUser, useUpdateUser } from '@/entities/user/api/queries.ts';

const profileSchema = z.object({
  name: z.string().min(4, 'Минимум 4 символа').max(30, 'Максимум 30 символов'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type ProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const ProfileDialog = ({ open, onOpenChange }: ProfileDialogProps) => {
  const { data: currentUser } = useCurrentUser();
  const { mutate, isPending } = useUpdateUser();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: currentUser?.name ?? '' },
  });

  useEffect(() => {
    if (!open) return;
    reset({ name: currentUser?.name ?? '' });
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarError(null);
  }, [open, currentUser?.name, reset]);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAvatarError(null);

    if (!file) {
      setAvatarFile(null);
      setAvatarPreview(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setAvatarError('Допустимые форматы: JPEG, PNG, WebP');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setAvatarError('Размер файла не должен превышать 2 МБ');
      e.target.value = '';
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleOpenChange = (next: boolean) => {
    if (isPending) return;
    onOpenChange(next);
  };

  const onSubmit = (values: ProfileFormValues) => {
    mutate(
      { name: values.name, avatarImage: avatarFile ?? undefined },
      {
        onSuccess: () => handleOpenChange(false),
      }
    );
  };

  const previewSrc = avatarPreview ?? currentUser?.avatarUrl ?? null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Профиль</DialogTitle>
          <DialogDescription>Измените имя и/или аватар</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Аватар</Label>
              <div className="flex items-center gap-5 flex-col">
                <div className="relative size-40 overflow-hidden rounded-full border bg-muted">
                  {previewSrc ? (
                    <img src={previewSrc} alt="Аватар" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-lg text-muted-foreground">Нет</div>
                  )}
                </div>
                <Button
                  nativeButton={false}
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  render={
                    <label className="cursor-pointer">
                      <Upload className="mr-2 size-4" />
                      Выбрать
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleAvatarChange}
                        disabled={isPending}
                      />
                    </label>
                  }
                />
              </div>
              {avatarError && <p className="text-sm text-destructive">{avatarError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input id="name" disabled={isPending} aria-invalid={!!errors.name} {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
          </div>

          <DialogFooter className="mt-5">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
              Отмена
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Сохранить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
