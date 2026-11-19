import { createContext, useContext } from 'react';

/** Create once at module scope for each compound component family. */
export function createSlotContext<Value extends object>(componentName: string) {
    const Context = createContext<Value | null>(null);
    Context.displayName = `${componentName}SlotContext`;

    function useSlotContext(partName = `${componentName} part`): Value {
        const value = useContext(Context);
        if (value === null) {
            throw new Error(
                `${partName} must be rendered inside <${componentName}>.`
            );
        }
        return value;
    }

    return { ContextProvider: Context.Provider, useSlotContext };
}
