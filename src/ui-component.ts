import type { JSXElementConstructor } from 'react';
import type {
    DefinitionContract,
    ResolveComponentOptions,
    ResolvedComponentResult,
    StyleDefinitionShape,
} from './providers-and-hooks/styles-manager/types';

/** Values resolved by this component, independent of other components' props. */
export type UIComponentInfluences<Definition extends StyleDefinitionShape> = [
    DefinitionContract<Definition>,
] extends [never]
    ? never
    : DefinitionContract<Definition> extends { influences: infer Influences }
      ? Influences
      : never;

/** No-influence definitions accept only an empty defaults object. */
export type UIComponentDefaults<Definition extends StyleDefinitionShape> = [
    DefinitionContract<Definition>,
] extends [never]
    ? never
    : keyof UIComponentInfluences<Definition> extends never
      ? Record<string, never>
      : UIComponentInfluences<Definition>;

export type UIComponentConfig<Definition extends StyleDefinitionShape> = {
    definition: Definition;
    defaults: NoInfer<UIComponentDefaults<Definition>>;
};

/** A hook bound to one component name and one createUI instance. */
export type UIComponentStylesHook<Definition extends StyleDefinitionShape> = (
    options: ResolveComponentOptions<Definition>
) => ResolvedComponentResult<Definition>;

/** The builder runs once; useStyles is called by the component during render. */
export type UIComponentBuilderOptions<Definition extends StyleDefinitionShape> =
    {
        defaults: UIComponentDefaults<Definition>;
        useStyles: UIComponentStylesHook<Definition>;
    };

/** Preserve the actual returned component type, including refs and static parts. */
export type UIComponentBuilder<
    Definition extends StyleDefinitionShape,
    Component extends JSXElementConstructor<never> =
        JSXElementConstructor<never>,
> = (options: UIComponentBuilderOptions<Definition>) => Component;
