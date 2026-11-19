import type { FieldInfluenceResolvers } from '../shared/types';
import type { TextAreaStyleDefinition, TextAreaTokens } from './types';

/**
 * The single authoring path for TextArea style definitions. Supported
 * feedback variant and theme names are inferred from the resolver maps; use
 * an empty entry (`info: {}`) for a name that needs no token overrides.
 */
export function defineTextAreaStyles<
    Variant extends string,
    Theme extends string,
>(
    definition: Omit<
        TextAreaStyleDefinition<NoInfer<Variant>, NoInfer<Theme>>,
        'influenceResolvers'
    > & {
        influenceResolvers: FieldInfluenceResolvers<
            TextAreaTokens,
            Variant,
            Theme
        >;
    }
): TextAreaStyleDefinition<Variant, Theme> {
    return definition;
}
