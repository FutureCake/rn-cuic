import type { TokenValue } from '../../providers-and-hooks/styles-manager/types';
import type { ChipInfluences, ChipStyleDefinition, ChipTokens } from './types';

/** One value map; callbacks receive the other influences, never their own. */
type InfluenceValueMap<
    Values extends string,
    OwnKey extends keyof ChipInfluences,
    Size extends string,
    Theme extends string,
> = {
    [Value in Values]: TokenValue<
        ChipTokens,
        Omit<ChipInfluences<Size, Theme>, OwnKey>
    >;
};

/**
 * The single authoring path for Chip style definitions. Supported size and
 * theme names are inferred from the resolver maps; use an empty entry
 * (`m: {}`) for a name that needs no token overrides.
 */
export function defineChipStyles<Size extends string, Theme extends string>(
    definition: Omit<
        ChipStyleDefinition<NoInfer<Size>, NoInfer<Theme>>,
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
): ChipStyleDefinition<Size, Theme> {
    return definition;
}
