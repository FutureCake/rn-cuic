import type { TokenValue } from '../../../providers-and-hooks/styles-manager/types';
import type {
    ButtonInfluences,
    ButtonStructure,
    ButtonStyleDefinition,
    ButtonTokens,
} from './types';

/**
 * One value map; callbacks receive the other influences, never their own,
 * plus the structure flags.
 */
type InfluenceValueMap<
    Values extends string,
    OwnKey extends keyof ButtonInfluences,
    Variant extends string,
    Shape extends string,
    Size extends string,
    Theme extends string,
> = {
    [Value in Values]: TokenValue<
        ButtonTokens,
        Omit<ButtonInfluences<Variant, Shape, Size, Theme>, OwnKey>,
        ButtonStructure
    >;
};

/**
 * The single authoring path for Button style definitions. Supported variant,
 * shape, size and theme names are inferred from the resolver maps; use an
 * empty entry (`outline: {}`) for a name that needs no token overrides.
 * Resolvers apply in declaration order, so later influences win.
 * `structureResolvers` is optional and applies after influences, before states.
 */
export function defineButtonStyles<
    Variant extends string,
    Shape extends string,
    Size extends string,
    Theme extends string,
>(
    definition: Omit<
        ButtonStyleDefinition<
            NoInfer<Variant>,
            NoInfer<Shape>,
            NoInfer<Size>,
            NoInfer<Theme>
        >,
        'influenceResolvers'
    > & {
        influenceResolvers: {
            variant: InfluenceValueMap<
                Variant,
                'variant',
                NoInfer<Variant>,
                NoInfer<Shape>,
                NoInfer<Size>,
                NoInfer<Theme>
            >;
            shape: InfluenceValueMap<
                Shape,
                'shape',
                NoInfer<Variant>,
                NoInfer<Shape>,
                NoInfer<Size>,
                NoInfer<Theme>
            >;
            size: InfluenceValueMap<
                Size,
                'size',
                NoInfer<Variant>,
                NoInfer<Shape>,
                NoInfer<Size>,
                NoInfer<Theme>
            >;
            theme: InfluenceValueMap<
                Theme,
                'theme',
                NoInfer<Variant>,
                NoInfer<Shape>,
                NoInfer<Size>,
                NoInfer<Theme>
            >;
        };
    }
): ButtonStyleDefinition<Variant, Shape, Size, Theme> {
    return definition;
}
