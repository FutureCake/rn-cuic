import type { TokenValue } from '../../../providers-and-hooks/styles-manager/types';
import type { TextInfluences, TextStyleDefinition, TextTokens } from './types';

/** One value map; callbacks receive the other influences, never their own. */
type InfluenceValueMap<
    Values extends string,
    OwnKey extends keyof TextInfluences,
    Variant extends string,
    Weight extends string,
    Theme extends string,
> = {
    [Value in Values]: TokenValue<
        TextTokens,
        Omit<TextInfluences<Variant, Weight, Theme>, OwnKey>
    >;
};

/**
 * The single authoring path for Text style definitions: the variant map is the
 * type scale. Supported theme, variant and weight names are inferred from the
 * resolver maps; use an empty entry (`body: {}`) for a name that needs no
 * token overrides. Variants may use any font role, including custom roles
 * declared in createUI `fonts`.
 */
export function defineTextStyles<
    Variant extends string,
    Weight extends string,
    Theme extends string,
>(
    definition: Omit<
        TextStyleDefinition<NoInfer<Variant>, NoInfer<Weight>, NoInfer<Theme>>,
        'influenceResolvers'
    > & {
        influenceResolvers: {
            theme: InfluenceValueMap<
                Theme,
                'theme',
                NoInfer<Variant>,
                NoInfer<Weight>,
                NoInfer<Theme>
            >;
            variant: InfluenceValueMap<
                Variant,
                'variant',
                NoInfer<Variant>,
                NoInfer<Weight>,
                NoInfer<Theme>
            >;
            weight: InfluenceValueMap<
                Weight,
                'weight',
                NoInfer<Variant>,
                NoInfer<Weight>,
                NoInfer<Theme>
            >;
        };
    }
): TextStyleDefinition<Variant, Weight, Theme> {
    return definition;
}
