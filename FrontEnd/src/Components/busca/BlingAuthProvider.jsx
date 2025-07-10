import React, { createContext, useContext } from 'react';
import { useBling } from './useBling';

const BlingAuthContext = createContext();

export const BlingAuthProvider = ({ children }) => {
  const bling = useBling();
  return (
    <BlingAuthContext.Provider value={bling}>
      {children}
    </BlingAuthContext.Provider>
  );
};

export const useBlingAuth = () => useContext(BlingAuthContext); 