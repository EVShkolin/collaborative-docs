import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage.tsx';
import { RegisterPage } from '@/pages/RegisterPage.tsx';
import { ProtectedRoute } from '@/providers/router/ProtectedRoute.tsx';
import { DocumentListPage } from '@/pages/DocumentListPage.tsx';
import { DocumentPage } from '@/pages/DocumentPage.tsx';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/documents" element={<DocumentListPage />} />
          <Route path="/documents/:documentId" element={<DocumentPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
