import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedComponent = ({ children, allowedRoles, usuarioLogado }) => {
  // Se o usuário não estiver logado ou não tiver o papel permitido, redireciona para a página de login
  if (!usuarioLogado.logado || !allowedRoles.includes(usuarioLogado.role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedComponent;
