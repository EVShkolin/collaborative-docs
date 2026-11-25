import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { useAuth } from '@/app/providers/auth/AuthContext.ts';
import { toast } from '@/shared/ui/toast.tsx';

export const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.add({
        title: 'Ошибка входа',
        description: 'Не удалось войти через сторонний сервис. Попробуйте ещё раз.',
        type: 'error',
      });
      navigate('/login', { replace: true });
      return;
    }

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    login(token);
    navigate('/documents', { replace: true });
  }, [searchParams, navigate, login]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
    </div>
  );
};