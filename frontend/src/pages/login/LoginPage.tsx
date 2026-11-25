import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { Button } from '@/shared/ui/button.tsx';
import { Input } from '@/shared/ui/input.tsx';
import { Label } from '@/shared/ui/label.tsx';
import { Separator } from '@/shared/ui/separator.tsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card.tsx';
import { GoogleIcon } from '@/shared/images/GoogleIcon.tsx';
import { GithubIcon } from '@/shared/images/GithubIcon.tsx';
import { toast } from '@/shared/ui/toast.tsx';

import { getAuthentication } from '@/shared/api/apiClient';
import { useAuth } from '@/app/providers/auth/AuthContext.ts';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/shared/ui/input-group.tsx';
const { postApiV1AuthLogin } = getAuthentication();

const GOOGLE_CONNECT_URL = 'http://localhost:8042/api/v1/auth/google/connect';
const GITHUB_CONNECT_URL = 'http://localhost:8042/api/v1/auth/github/connect';

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(5, 'Минимум 5 символов'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await postApiV1AuthLogin(values);
      login(response.token);
      navigate('/documents');
    } catch {
      toast.add({ title: 'Ошибка входа', description: 'Неверный email или пароль', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Вход в аккаунт</CardTitle>
          <CardDescription>Введите email и пароль, чтобы продолжить</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" type="button" onClick={() => window.location.assign(GOOGLE_CONNECT_URL)}>
              <GoogleIcon className="mr-2 size-4" /> Google
            </Button>
            <Button variant="outline" type="button" onClick={() => window.location.assign(GITHUB_CONNECT_URL)}>
              <GithubIcon className="mr-2 size-4" /> GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">или</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Пароль</Label>
                <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
                  Забыли пароль?
                </Link>
              </div>

              <InputGroup className="bg-muted">
                <InputGroupInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
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

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Войти
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Нет аккаунта?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
