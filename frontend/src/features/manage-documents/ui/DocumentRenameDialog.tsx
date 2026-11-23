import { z } from 'zod';
import { useEffect } from 'react';
import { useUpdateDocument } from '@/entities/document/api/queries.ts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/shared/ui/toast.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog.tsx';
import { Button } from '@/shared/ui/button.tsx';
import { Loader2 } from 'lucide-react';
import { Label } from '@/shared/ui/label.tsx';
import { Input } from '@/shared/ui/input.tsx';

const documentSchema = z.object({
  title: z.string().min(1).max(255),
});

type DocumentFormValues = z.infer<typeof documentSchema>;

type DocumentRenameDialogProps = {
  documentId: string;
  oldTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const DocumentRenameDialog = ({ documentId, oldTitle, open, onOpenChange }: DocumentRenameDialogProps) => {
  const { mutate, isPending } = useUpdateDocument(documentId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: { title: oldTitle },
  });

  useEffect(() => {
    if (open) reset({ title: oldTitle });
  }, [open, oldTitle, reset]);

  const handleOpenChange = (next: boolean) => {
    if (isPending) return;
    onOpenChange(next);
  };

  const onSubmit = (values: DocumentFormValues) => {
    mutate(
      { title: values.title },
      {
        onSuccess: () => handleOpenChange(false),
        onError: () => {
          toast.add({
            title: 'Ошибка обновления документа',
            description: 'Не удалось обновить документ. Попробуйте позже',
            type: 'error',
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Переименовать документ</DialogTitle>
          <DialogDescription>Напишите новое название документа</DialogDescription>
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
