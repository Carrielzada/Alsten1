import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedComponent = ({ children, allowedRoles, usuarioLogado }) => {
  if (!usuarioLogado.logado || !allowedRoles.includes(usuarioLogado.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedComponent;
