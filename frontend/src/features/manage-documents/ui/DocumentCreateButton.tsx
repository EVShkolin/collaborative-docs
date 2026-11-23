import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog.tsx';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button.tsx';
import { Label } from '@/shared/ui/label.tsx';
import { Input } from '@/shared/ui/input.tsx';
import { useState } from 'react';
import { useCreateDocument } from '@/entities/document/api/queries.ts';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/shared/ui/toast.tsx';

const documentSchema = z.object({
  title: z.string().min(1).max(255),
});

type DocumentFormValues = z.infer<typeof documentSchema>;

export const DocumentCreateButton = () => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateDocument();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: { title: '' },
  });

  const handleOpenChange = (next: boolean) => {
    if (isPending) return;
    setOpen(next);
    if (!next) reset();
  };

  const onSubmit = (values: DocumentFormValues) => {
    mutate(
      { title: values.title },
      {
        onSuccess: () => handleOpenChange(false),
        onError: () => {
          toast.add({
            title: 'Ошибка создания документа',
            description: 'Не удалось создать документ. Попробуйте позже',
            type: 'error',
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button size="lg">
            <Plus size={16} strokeWidth={2.5} />
            Создать документ
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать новый документ</DialogTitle>
          <DialogDescription>Новый документ для одновременного редактирования</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="title">Название документа</Label>
            <Input id="title" disabled={isPending} aria-invalid={!!errors.title} {...register('title')} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
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
