import type { TokenValue } from '../../providers-and-hooks/styles-manager/types';
import type {
    ToggleInfluences,
    ToggleStyleDefinition,
    ToggleTokens,
} from './types';

/**
 * The single authoring path for Toggle style definitions. Supported theme
 * names are inferred from the resolver map; use an empty entry (`day: {}`)
 * for a name that needs no token overrides.
 */
export function defineToggleStyles<Theme extends string>(
    definition: Omit<
        ToggleStyleDefinition<NoInfer<Theme>>,
        'influenceResolvers'
    > & {
        influenceResolvers: {
            theme: {
                [Value in Theme]: TokenValue<
                    ToggleTokens,
                    Omit<ToggleInfluences<NoInfer<Theme>>, 'theme'>
                >;
            };
        };
    }
): ToggleStyleDefinition<Theme> {
    return definition;
}
