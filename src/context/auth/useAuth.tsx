
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth was called outside of AuthProvider! Check component hierarchy.');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
