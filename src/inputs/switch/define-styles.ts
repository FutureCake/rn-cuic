import type { TokenValue } from '../../providers-and-hooks/styles-manager/types';
import type {
    SwitchInfluences,
    SwitchStyleDefinition,
    SwitchTokens,
} from './types';

/**
 * The single authoring path for Switch style definitions. Supported theme
 * names are inferred from the resolver map; use an empty entry (`day: {}`)
 * for a name that needs no token overrides.
 */
export function defineSwitchStyles<Theme extends string>(
    definition: Omit<
        SwitchStyleDefinition<NoInfer<Theme>>,
        'influenceResolvers'
    > & {
        influenceResolvers: {
            theme: {
                [Value in Theme]: TokenValue<
                    SwitchTokens,
                    Omit<SwitchInfluences<NoInfer<Theme>>, 'theme'>
                >;
            };
        };
    }
): SwitchStyleDefinition<Theme> {
    return definition;
}
