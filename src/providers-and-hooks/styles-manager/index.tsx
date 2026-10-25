import { createContext, useContext, type ReactNode } from 'react';
import { resolveComponentStyles } from './resolve';
import type {
    ResolveComponentOptions,
    ResolvedComponentStyles,
    StyleDefinitionShape,
} from './types';

/**
 * Creates an isolated provider/hook pair bound to a typed component collection.
 * Annotate each entry with its StyleDefinition to preserve all supported props,
 * states and slots, including optional resolvers not configured initially.
 */
export function createStylesManager<
    Definitions extends {
        [Component in keyof Definitions]: StyleDefinitionShape;
    },
>(defaultStyles: Definitions) {
    const Context = createContext<Definitions | null>(null);

    function StylesProvider({
        children,
        styles = defaultStyles,
    }: {
        children: ReactNode;
        styles?: NoInfer<Definitions>;
    }) {
        return <Context.Provider value={styles}>{children}</Context.Provider>;
    }

    function useResolveComponentStyles<
        Component extends keyof Definitions & string,
    >(
        component: Component,
        options: ResolveComponentOptions<Definitions[NoInfer<Component>]>
    ): ResolvedComponentStyles<Definitions[Component]> {
        const styles = useContext(Context);
        if (styles === null) {
            throw new Error(
                'useResolveComponentStyles must be used within StylesProvider.'
            );
        }
        return resolveComponentStyles(styles[component], options);
    }

    return { StylesProvider, useResolveComponentStyles };
}

export { resolveComponentStyles } from './resolve';
export type * from './types';
