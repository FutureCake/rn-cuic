import type { TokenValue } from '../../../providers-and-hooks/styles-manager/types';
import type { IconInfluences, IconStyleDefinition, IconTokens } from './types';

/** One value map; callbacks receive the other influences, never their own. */
type InfluenceValueMap<
    Values extends string,
    OwnKey extends keyof IconInfluences,
    Size extends string,
    Theme extends string,
> = {
    [Value in Values]: TokenValue<
        IconTokens,
        Omit<IconInfluences<Size, Theme>, OwnKey>
    >;
};

/**
 * The single authoring path for Icon style definitions. Supported size and
 * theme names are inferred from the resolver maps; use an empty entry
 * (`m: {}`) for a name that needs no token overrides.
 */
export function defineIconStyles<Size extends string, Theme extends string>(
    definition: Omit<
        IconStyleDefinition<NoInfer<Size>, NoInfer<Theme>>,
        'influenceResolvers'
    > & {
        influenceResolvers: {
            size: InfluenceValueMap<
                Size,
                'size',
                NoInfer<Size>,
                NoInfer<Theme>
            >;
            theme: InfluenceValueMap<
                Theme,
                'theme',
                NoInfer<Size>,
                NoInfer<Theme>
            >;
        };
    }
): IconStyleDefinition<Size, Theme> {
    return definition;
}
