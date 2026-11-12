import type { InfluenceValueMap } from '../shared/types';
import type { TextFieldStyleDefinition, TextFieldTokens } from './types';

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
                TextFieldTokens,
                Theme,
                'theme',
                NoInfer<Variant>,
                NoInfer<Theme>
            >;
            feedbackVariant: InfluenceValueMap<
                TextFieldTokens,
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
