import { createContext } from 'react';
import { ConfirmContextType } from './types';

export default createContext<ConfirmContextType>({
  confirm: () => {
    throw new Error('Missing ConfirmProvider');
  },
  closeOnParentUnmount: () => {},
});
