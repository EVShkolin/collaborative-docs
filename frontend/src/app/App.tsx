import { AuthProvider } from '@/app/providers/auth/AuthProvider.tsx';
import { AppRouter } from '@/app/providers/router/AppRouter.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/api/queryClient.ts';
import { ThemeProvider } from '@/app/providers/theme/ThemeProvider.tsx';
import { Toaster } from '@/shared/ui/toast.tsx';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <ThemeProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
