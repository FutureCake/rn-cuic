import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { resolveComponentStyles } from './resolve';
import type {
    ResolveComponentOptions,
    ResolvedComponentResult,
    StyleDefinitionOverride,
    StyleDefinitionShape,
} from './types';

/**
 * Creates an isolated provider/hook set bound to a typed component collection
 * and an ambient theme. Author definitions with the component's define helper
 * (for example defineButtonStyles) to preserve the full typed contract.
 */
export function createStylesManager<
    Definitions extends {
        [Component in keyof Definitions]: StyleDefinitionShape;
    },
    Theme extends string,
>(defaultStyles: Definitions, defaultTheme: Theme) {
    const StylesContext = createContext<Definitions | null>(null);
    const ThemeContext = createContext<{
        theme: Theme;
        setTheme: (theme: Theme) => void;
    } | null>(null);

    /** Section-wise merge: provided sections win per key, the rest stay default. */
    function mergeDefinitions(
        overrides:
            | {
                  [Name in keyof Definitions]?: StyleDefinitionOverride<
                      Definitions[Name]
                  >;
              }
            | undefined
    ): Definitions {
        if (overrides === undefined) {
            return defaultStyles;
        }
        const merged = { ...defaultStyles } as Record<
            string,
            StyleDefinitionShape
        >;
        for (const [name, override] of Object.entries(
            overrides as Record<string, Partial<StyleDefinitionShape>>
        )) {
            const base = merged[name];
            if (base === undefined || override === undefined) {
                continue;
            }
            merged[name] = {
                ...base,
                ...override,
                defaultTokens: {
                    ...base.defaultTokens,
                    ...override.defaultTokens,
                },
                influenceResolvers: {
                    ...base.influenceResolvers,
                    ...override.influenceResolvers,
                },
                stateResolvers: {
                    ...base.stateResolvers,
                    ...override.stateResolvers,
                },
                slotStyles: { ...base.slotStyles, ...override.slotStyles },
            };
        }
        return merged as Definitions;
    }

    function StylesProvider({
        children,
        styles,
        theme: themeProp,
    }: {
        children: ReactNode;
        /** Partial per-component overrides, merged section-wise over the defaults. */
        styles?: {
            [Name in keyof Definitions]?: StyleDefinitionOverride<
                Definitions[Name]
            >;
        };
        /** Controls the ambient theme; omit to let setTheme manage it. */
        theme?: NoInfer<Theme>;
    }) {
        const [internalTheme, setTheme] = useState(defaultTheme);
        const theme = themeProp ?? internalTheme;
        const definitions = useMemo(() => mergeDefinitions(styles), [styles]);
        const themeValue = useMemo(() => ({ theme, setTheme }), [theme]);
        return (
            <StylesContext.Provider value={definitions}>
                <ThemeContext.Provider value={themeValue}>
                    {children}
                </ThemeContext.Provider>
            </StylesContext.Provider>
        );
    }

    /** Ambient theme for this UI instance; shared by apps and components. */
    function useTheme(): { theme: Theme; setTheme: (theme: Theme) => void } {
        const value = useContext(ThemeContext);
        if (value === null) {
            throw new Error('useTheme must be used within StylesProvider.');
        }
        return value;
    }

    function useResolveComponentStyles<
        Component extends keyof Definitions & string,
    >(
        component: Component,
        options: ResolveComponentOptions<Definitions[NoInfer<Component>]>
    ): ResolvedComponentResult<Definitions[Component]> {
        const styles = useContext(StylesContext);
        if (styles === null) {
            throw new Error(
                'useResolveComponentStyles must be used within StylesProvider.'
            );
        }
        return resolveComponentStyles(styles[component], options);
    }

    return { StylesProvider, useTheme, useResolveComponentStyles };
}

export { resolveComponentStyles } from './resolve';
export type * from './types';
