import { createStylesManager } from './providers-and-hooks/styles-manager';
import type { StyleDefinitionShape } from './providers-and-hooks/styles-manager/types';

export * from './providers-and-hooks';
export * from './utils';

/**
 * Instance wiring handed to a descriptor's build step. The hooks are bound to
 * the created instance's styles manager; factories cast `useStyles` to their
 * component's precisely typed contract.
 */
export type UIComponentWiring<Theme extends string> = {
    useStyles: (options: never) => { styles: never; tokens: never };
    useTheme: () => { theme: Theme; setTheme: (theme: Theme) => void };
};

/**
 * A buildable component entry for createUI, produced by a component's
 * `<component>Factory` subpath export (for example `buttonFactory()` from
 * 'rn-cuic/button'). Importing only the factories you use keeps unused
 * components out of the bundle.
 */
export type UIComponentDescriptor<
    Definition extends StyleDefinitionShape,
    Theme extends string,
    Component,
> = {
    definition: Definition;
    build: (wiring: UIComponentWiring<Theme>) => Component;
};

type BuiltComponentOf<Descriptor> = Descriptor extends {
    build: (wiring: never) => infer Component;
}
    ? Component
    : never;

/**
 * Create once at module scope, passing a descriptor per component the app
 * uses. Returned components and hooks use this instance's provider, not
 * another createUI instance's. Each key names its component in the returned
 * object and in the provider's `styles` overrides.
 */
export function createUI<
    Theme extends string,
    Components extends Record<
        string,
        UIComponentDescriptor<StyleDefinitionShape, Theme, unknown>
    >,
>(config: {
    /** Initial ambient theme for this instance's StylesProvider. */
    theme: NoInfer<Theme>;
    components: Components &
        Record<
            string,
            UIComponentDescriptor<StyleDefinitionShape, Theme, unknown>
        >;
}): {
    [Key in keyof Components]: BuiltComponentOf<Components[Key]>;
} & ReturnType<
    typeof createStylesManager<
        { [Key in keyof Components]: Components[Key]['definition'] },
        Theme
    >
>;
export function createUI(config: {
    theme: string;
    components: Record<
        string,
        UIComponentDescriptor<StyleDefinitionShape, string, unknown>
    >;
}): unknown {
    const definitions: Record<string, StyleDefinitionShape> = {};
    for (const [key, descriptor] of Object.entries(config.components)) {
        definitions[key] = descriptor.definition;
    }
    const manager = createStylesManager(definitions, config.theme);
    const ui: Record<string, unknown> = { ...manager };
    for (const [key, descriptor] of Object.entries(config.components)) {
        ui[key] = descriptor.build({
            useStyles: function useComponentStyles(options: never) {
                return manager.useResolveComponentStyles(key, options);
            } as never,
            useTheme: manager.useTheme,
        });
    }
    return ui;
}
