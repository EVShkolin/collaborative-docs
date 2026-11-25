import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/login/LoginPage.tsx';
import { RegisterPage } from '@/pages/register/RegisterPage.tsx';
import { ProtectedRoute } from '@/app/providers/router/ProtectedRoute.tsx';
import { DocumentListPage } from '@/pages/document-list/DocumentListPage.tsx';
import { DocumentPage } from '@/pages/document/DocumentPage.tsx';
import { AuthCallbackPage } from '@/pages/login/AuthCallbackPage.tsx';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path='/auth/callback' element={<AuthCallbackPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to={'/documents'} />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/documents" element={<DocumentListPage />} />
          <Route path="/documents/:documentId" element={<DocumentPage />} />
        </Route>
        <Route path='*' element={<Navigate to={'/documents'} />} />
      </Routes>
    </BrowserRouter>
  );
};
