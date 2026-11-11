import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Checkbox } from '@/shared/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { toast } from '@/shared/ui/toast.tsx';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/shared/ui/input-group.tsx';

import { getUsers, getAuthentication } from '@/shared/api/apiClient';
import { useAuth } from '@/app/providers/auth/AuthContext.ts';
import axios, { type AxiosError } from 'axios';
import type { ValidationErrorDto } from '@/shared/api/model';

const { postApiV1AuthLogin } = getAuthentication();
const { postV1UsersSave } = getUsers();

const registerSchema = z
  .object({
    name: z.string().min(4, 'Минимум 4 символа').max(30, 'Максимум 30 символов'),
    email: z.email(),
    password: z.string().min(5, 'Минимум 5 символов'),
    confirmPassword: z.string().min(5, 'Подтвердите пароль'),
    terms: z.boolean().refine((v) => v === true, {
      message: 'Необходимо нажать на этот чекбокс',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);

    try {
      await postV1UsersSave(values);
      const loginResponse = await postApiV1AuthLogin({ email: values.email, password: values.password });
      login(loginResponse.token);
      navigate('/documents');
    } catch (err) {
      if (!axios.isAxiosError<ValidationErrorDto>(err)) {
        toast.add({
          title: 'Ошибка регистрации',
          description: 'Не удалось создать аккаунт. Попробуйте позже.',
          type: 'error',
        });
      }

      const axiosErr = err as AxiosError<ValidationErrorDto>;
      const message = axiosErr.response?.data.errors.email;
      if (message && /The email .+ already exists\./i.test(message)) {
        setError('email', { type: 'server', message: 'Этот email уже занят' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Создать аккаунт</CardTitle>
          <CardDescription>Заполните форму, чтобы зарегистрироваться</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                className="bg-muted"
                placeholder="Иван Иванов"
                autoComplete="name"
                aria-invalid={!!errors.name}
                {...register('name')}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                className="bg-muted"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <InputGroup className="bg-muted">
                <InputGroupInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Минимум 5 символов"
                  autoComplete="new-password"
                  className="pr-10"
                  aria-invalid={!!errors.password}
                  {...register('password')}
                />
                <InputGroupAddon align="inline-end">
                  <Button variant="ghost" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </InputGroupAddon>
              </InputGroup>
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
              <Input
                id="confirmPassword"
                className="bg-muted"
                type={showPassword ? 'text' : 'password'}
                placeholder="Повторите пароль"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  className="mt-0.5 bg-muted border border-border"
                  onCheckedChange={(checked) => setValue('terms', checked === true, { shouldValidate: true })}
                />
                <Label htmlFor="terms" className="text-sm font-normal leading-snug">
                  Я нажимаю на этот чекбокс
                </Label>
              </div>
              {errors.terms && <p className="text-sm text-destructive">{errors.terms.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Зарегистрироваться
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Войти
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
