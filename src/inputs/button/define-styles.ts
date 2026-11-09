import type { TokenValue } from '../../providers-and-hooks/styles-manager/types';
import type {
    ButtonInfluences,
    ButtonStyleDefinition,
    ButtonTokens,
} from './types';

/**
 * Infer supported names from resolver keys, retaining the full definition contract.
 * Use an empty entry (`outline: {}`) for a name that needs no token overrides.
 * For sparse resolver maps, annotate with ButtonStyleDefinition<V, S, T> instead.
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
            variantResolver: {
                [Value in Variant]: TokenValue<
                    ButtonTokens,
                    Omit<
                        ButtonInfluences<
                            NoInfer<Variant>,
                            NoInfer<Size>,
                            NoInfer<Theme>
                        >,
                        'variant'
                    >
                >;
            };
            sizeResolver: {
                [Value in Size]: TokenValue<
                    ButtonTokens,
                    Omit<
                        ButtonInfluences<
                            NoInfer<Variant>,
                            NoInfer<Size>,
                            NoInfer<Theme>
                        >,
                        'size'
                    >
                >;
            };
            themeResolver: {
                [Value in Theme]: TokenValue<
                    ButtonTokens,
                    Omit<
                        ButtonInfluences<
                            NoInfer<Variant>,
                            NoInfer<Size>,
                            NoInfer<Theme>
                        >,
                        'theme'
                    >
                >;
            };
        };
    }
): ButtonStyleDefinition<Variant, Size, Theme> {
    return definition;
}
