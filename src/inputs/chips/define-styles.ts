import type { TokenValue } from '../../providers-and-hooks/styles-manager/types';
import type {
    ChipsInfluences,
    ChipsLayout,
    ChipsStyleDefinition,
    ChipsTokens,
} from './types';

/** One value map; callbacks receive the other influences, never their own. */
type InfluenceValueMap<
    Values extends string,
    OwnKey extends keyof ChipsInfluences,
    Variant extends string,
    Theme extends string,
> = {
    [Value in Values]: TokenValue<
        ChipsTokens,
        Omit<ChipsInfluences<Variant, Theme>, OwnKey>
    >;
};

/**
 * The single authoring path for Chips style definitions. Supported feedback
 * variant and theme names are inferred from the resolver maps; layout values
 * are fixed (they drive structure). Use an empty entry (`wrap: {}`) for a
 * name that needs no token overrides.
 */
export function defineChipsStyles<Variant extends string, Theme extends string>(
    definition: Omit<
        ChipsStyleDefinition<NoInfer<Variant>, NoInfer<Theme>>,
        'influenceResolvers'
    > & {
        influenceResolvers: {
            layout: InfluenceValueMap<
                ChipsLayout,
                'layout',
                NoInfer<Variant>,
                NoInfer<Theme>
            >;
            feedbackVariant: InfluenceValueMap<
                Variant,
                'feedbackVariant',
                NoInfer<Variant>,
                NoInfer<Theme>
            >;
            theme: InfluenceValueMap<
                Theme,
                'theme',
                NoInfer<Variant>,
                NoInfer<Theme>
            >;
        };
    }
): ChipsStyleDefinition<Variant, Theme> {
    return definition;
}
