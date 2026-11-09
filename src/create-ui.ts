import type { JSXElementConstructor } from 'react';
import { createButton } from './inputs/button/create-button';
import type {
    ButtonInfluences,
    ButtonStyleDefinition,
} from './inputs/button/types';
import { createStylesManager } from './providers-and-hooks/styles-manager';
import type {
    ResolveComponentOptions,
    ResolvedComponentResult,
    StyleDefinitionShape,
} from './providers-and-hooks/styles-manager/types';
import type {
    UIComponentBuilder,
    UIComponentConfig,
    UIComponentDefaults,
} from './ui-component';

/** Compatibility alias for the original Button-only configuration. */
export type UIConfig<
    Variant extends string,
    Size extends string,
    Theme extends string,
> = {
    Button: {
        definition: ButtonStyleDefinition<Variant, Size, Theme>;
        defaults: NoInfer<ButtonInfluences<Variant, Size, Theme>>;
    };
};

type ReservedName =
    | 'StylesProvider'
    | 'useResolveComponentStyles'
    | '__proto__'
    | 'constructor'
    | 'prototype';

type DefinitionCollection<Definitions> = {
    [Name in keyof Definitions]: StyleDefinitionShape;
};

/** Each entry derives its defaults from its own annotated definition. */
export type UIComponentsConfig<
    Definitions extends DefinitionCollection<Definitions>,
> = {
    [Name in keyof Definitions]: Name extends string
        ? Name extends ReservedName
            ? never
            : UIComponentConfig<Definitions[Name]> &
                  (Name extends 'Button'
                      ? ButtonConstraint<Definitions[Name]>
                      : unknown)
        : never;
};

type ButtonConstraint<Definition extends StyleDefinitionShape> =
    UIComponentDefaults<Definition> extends ButtonInfluences<
        infer Variant,
        infer Size,
        infer Theme
    >
        ? Exclude<
              keyof UIComponentDefaults<Definition>,
              keyof ButtonInfluences
          > extends never
            ? Definition extends ButtonStyleDefinition<Variant, Size, Theme>
                ? unknown
                : never
            : never
        : never;

type ConfiguredButton<Definition extends StyleDefinitionShape> =
    UIComponentDefaults<Definition> extends ButtonInfluences<
        infer Variant,
        infer Size,
        infer Theme
    >
        ? ReturnType<typeof createButton<Variant, Size, Theme>>
        : never;

type CustomNames<Definitions> = Exclude<keyof Definitions, 'Button'>;
type BuilderShape = (options: never) => JSXElementConstructor<never>;

type RegisteredComponents<
    Definitions extends DefinitionCollection<Definitions>,
    Builders,
> = {
    [Name in keyof Definitions]: Name extends 'Button'
        ? ConfiguredButton<Definitions[Name]>
        : Name extends keyof Builders
          ? Builders[Name] extends BuilderShape
              ? ReturnType<Builders[Name]>
              : never
          : never;
};

type UIResult<
    Definitions extends DefinitionCollection<Definitions>,
    Builders,
> = RegisteredComponents<Definitions, Builders> &
    ReturnType<typeof createStylesManager<Definitions>>;

/**
 * Create once at module scope. Returned components and hooks use this instance's
 * provider, not the library's default provider or another createUI instance.
 */
export function createUI<
    Variant extends string,
    Size extends string,
    Theme extends string,
>(
    config: UIConfig<Variant, Size, Theme>
): UIResult<{ Button: ButtonStyleDefinition<Variant, Size, Theme> }, {}>;
export function createUI<
    Definitions extends DefinitionCollection<Definitions>,
    Builders extends { [Name in CustomNames<Definitions>]: BuilderShape },
>(
    config: UIComponentsConfig<Definitions>,
    options: {
        components: Builders & {
            [Name in CustomNames<Definitions>]: UIComponentBuilder<
                NoInfer<Definitions[Name]>
            >;
        } & Record<Exclude<keyof Builders, CustomNames<Definitions>>, never>;
    }
): UIResult<Definitions, Builders>;
export function createUI(config: unknown, options?: unknown): unknown {
    if (!isRecord(config)) {
        throw new Error('createUI requires a component configuration object.');
    }
    const components = getCustomBuilders(options);
    const names = componentNames(config);

    for (const name of componentNames(components)) {
        if (hasOwn(builtInComponents, name)) {
            throw new Error(`Cannot replace built-in component "${name}".`);
        }
        if (!hasOwn(config, name)) {
            throw new Error(
                `Builder "${name}" has no component configuration.`
            );
        }
        if (typeof components[name] !== 'function') {
            throw new Error(`Builder "${name}" must be a function.`);
        }
    }

    // Validate the entire collection before creating contexts or invoking builders.
    const entries = Object.fromEntries(
        names.map((name) => {
            const entry = config[name];
            validateConfig(name, entry);
            if (hasOwn(builtInComponents, name)) {
                builtInComponents[name]!.validate?.(entry);
            } else if (!hasOwn(components, name)) {
                throw new Error(
                    `Component "${name}" requires a registered builder.`
                );
            }
            return [name, entry];
        })
    );
    const definitions = Object.fromEntries(
        names.map((name) => [name, entries[name]!.definition])
    );
    const manager = createStylesManager(definitions);
    const built = Object.fromEntries(
        names.map((name) => {
            // Iteration erases per-key contracts; the public overloads retain them.
            const builder = (
                hasOwn(builtInComponents, name)
                    ? builtInComponents[name]!.build
                    : components[name]
            ) as RuntimeBuilder;
            const component = builder({
                defaults: { ...entries[name]!.defaults },
                useStyles: function useComponentStyles(resolveOptions) {
                    return manager.useResolveComponentStyles(
                        name,
                        resolveOptions
                    );
                },
            });
            if (
                typeof component !== 'function' &&
                !(isRecord(component) && wrapperTypes.has(component.$$typeof))
            ) {
                throw new Error(
                    `Builder "${name}" must return a React component.`
                );
            }
            return [name, component];
        })
    );
    return { ...built, ...manager };
}

type RuntimeBuilder = (options: {
    defaults: object;
    useStyles: (
        options: ResolveComponentOptions<StyleDefinitionShape>
    ) => ResolvedComponentResult<StyleDefinitionShape>;
}) => unknown;

type RuntimeComponentConfig = {
    definition: StyleDefinitionShape;
    defaults: Record<string, unknown>;
};

const builtInComponents: Readonly<
    Record<
        string,
        {
            build: RuntimeBuilder;
            validate?: (entry: RuntimeComponentConfig) => void;
        }
    >
> = {
    Button: {
        build: createButton as unknown as RuntimeBuilder,
        validate: ({ defaults, definition }) => {
            if (
                Object.keys(defaults).length !== 3 ||
                ['variant', 'size', 'theme'].some(
                    (key) => typeof defaults[key] !== 'string'
                ) ||
                ['container', 'text', 'icon'].some(
                    (slot) => typeof definition.slotStyles[slot] !== 'function'
                )
            ) {
                throw new Error(
                    'Button requires variant, size and theme defaults and its three slots.'
                );
            }
        },
    },
};
// React wrappers are valid component types; React element objects are not.
const wrapperTypes = new Set<unknown>([
    Symbol.for('react.memo'),
    Symbol.for('react.forward_ref'),
    Symbol.for('react.lazy'),
    Symbol.for('react.context'),
    Symbol.for('react.provider'),
    Symbol.for('react.consumer'),
]);
const reservedNames = new Set<string>([
    'StylesProvider',
    'useResolveComponentStyles',
    '__proto__',
    'constructor',
    'prototype',
]);
const hasOwn = (object: object, key: PropertyKey) =>
    Object.prototype.hasOwnProperty.call(object, key);

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function componentNames(object: object): string[] {
    return Reflect.ownKeys(object).map((name) => {
        if (typeof name !== 'string' || reservedNames.has(name)) {
            throw new Error(
                `Invalid or reserved component name "${String(name)}".`
            );
        }
        return name;
    });
}

function getCustomBuilders(options: unknown): Record<string, unknown> {
    if (options === undefined) {
        return {};
    }
    if (!isRecord(options) || !isRecord(options.components)) {
        throw new Error('createUI options must contain a components object.');
    }
    return options.components;
}

function validateConfig(
    name: string,
    entry: unknown
): asserts entry is RuntimeComponentConfig {
    if (
        !isRecord(entry) ||
        !isRecord(entry.defaults) ||
        !isRecord(entry.definition)
    ) {
        throw new Error(
            `Component "${name}" requires definition and defaults objects.`
        );
    }
    const definition = entry.definition;
    if (
        !isRecord(definition.defaultTokens) ||
        !isRecord(definition.influenceResolvers) ||
        !isRecord(definition.stateResolvers) ||
        !isRecord(definition.slotStyles) ||
        Object.values(definition.slotStyles).some(
            (slot) => typeof slot !== 'function'
        )
    ) {
        throw new Error(`Component "${name}" has an invalid style definition.`);
    }
    for (const order of [definition.influenceOrder, definition.stateOrder]) {
        if (
            order !== undefined &&
            (!Array.isArray(order) ||
                order.some((key) => typeof key !== 'string'))
        ) {
            throw new Error(
                `Component "${name}" resolver orders must be string arrays.`
            );
        }
    }
    if (
        definition.transition !== undefined &&
        !isRecord(definition.transition)
    ) {
        throw new Error(`Component "${name}" transition must be an object.`);
    }
    for (const value of Object.values(entry.defaults)) {
        if (!['string', 'number', 'symbol'].includes(typeof value)) {
            throw new Error(
                `Component "${name}" defaults must be property-key values.`
            );
        }
    }
}
