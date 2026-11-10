import type { TokenValue } from '../../providers-and-hooks/styles-manager/types';
import type {
    TextFieldInfluences,
    TextFieldStyleDefinition,
    TextFieldTokens,
} from './types';

/** One value map; callbacks receive the other influences, never their own. */
type InfluenceValueMap<
    Values extends string,
    OwnKey extends keyof TextFieldInfluences,
    Variant extends string,
    Theme extends string,
> = {
    [Value in Values]: TokenValue<
        TextFieldTokens,
        Omit<TextFieldInfluences<Variant, Theme>, OwnKey>
    >;
};

/**
 * The single authoring path for TextField style definitions. Supported
 * feedback variant and theme names are inferred from the resolver maps; use
 * an empty entry (`info: {}`) for a name that needs no token overrides.
 */
export function defineTextFieldStyles<
    Variant extends string,
    Theme extends string,
>(
    definition: Omit<
        TextFieldStyleDefinition<NoInfer<Variant>, NoInfer<Theme>>,
        'influenceResolvers'
    > & {
        influenceResolvers: {
            theme: InfluenceValueMap<
                Theme,
                'theme',
                NoInfer<Variant>,
                NoInfer<Theme>
            >;
            feedbackVariant: InfluenceValueMap<
                Variant,
                'feedbackVariant',
                NoInfer<Variant>,
                NoInfer<Theme>
            >;
        };
    }
): TextFieldStyleDefinition<Variant, Theme> {
    return definition;
}
