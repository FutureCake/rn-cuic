import type { TokenValue } from '../../providers-and-hooks/styles-manager/types';
import type {
    ButtonInfluences,
    ButtonStyleDefinition,
    ButtonTokens,
} from './types';

/** One value map; callbacks receive the other influences, never their own. */
type InfluenceValueMap<
    Values extends string,
    OwnKey extends keyof ButtonInfluences,
    Variant extends string,
    Size extends string,
    Theme extends string,
> = {
    [Value in Values]: TokenValue<
        ButtonTokens,
        Omit<ButtonInfluences<Variant, Size, Theme>, OwnKey>
    >;
};

/**
 * The single authoring path for Button style definitions. Supported variant,
 * size and theme names are inferred from the resolver maps; use an empty
 * entry (`outline: {}`) for a name that needs no token overrides.
 */
export function defineButtonStyles<
    Variant extends string,
    Size extends string,
    Theme extends string,
>(
    definition: Omit<
        ButtonStyleDefinition<NoInfer<Variant>, NoInfer<Size>, NoInfer<Theme>>,
        'influenceResolvers'
    > & {
        influenceResolvers: {
            variant: InfluenceValueMap<
                Variant,
                'variant',
                NoInfer<Variant>,
                NoInfer<Size>,
                NoInfer<Theme>
            >;
            size: InfluenceValueMap<
                Size,
                'size',
                NoInfer<Variant>,
                NoInfer<Size>,
                NoInfer<Theme>
            >;
            theme: InfluenceValueMap<
                Theme,
                'theme',
                NoInfer<Variant>,
                NoInfer<Size>,
                NoInfer<Theme>
            >;
        };
    }
): ButtonStyleDefinition<Variant, Size, Theme> {
    return definition;
}
