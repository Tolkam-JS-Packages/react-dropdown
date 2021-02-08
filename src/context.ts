import { ContextType, createContext } from 'react';
import Root from './Root';

const DropdownContext = createContext<Root|null>(null);

DropdownContext.displayName = 'DropdownContext';

type TContext = NonNullable<ContextType<typeof DropdownContext>>;

export default DropdownContext;
export { TContext }
