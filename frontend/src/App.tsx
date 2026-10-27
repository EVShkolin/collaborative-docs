import { AuthProvider } from '@/providers/auth/AuthProvider.tsx';
import { AppRouter } from '@/providers/router/AppRouter.tsx';

const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;
