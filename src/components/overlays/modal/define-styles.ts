import type { TokenValue } from '../../../providers-and-hooks/styles-manager/types';
import type {
    ModalInfluences,
    ModalStyleDefinition,
    ModalTokens,
} from './types';

/**
 * The single authoring path for Modal style definitions. Supported theme
 * names are inferred from the resolver map; use an empty entry (`day: {}`)
 * for a name that needs no token overrides.
 */
export function defineModalStyles<Theme extends string>(
    definition: Omit<
        ModalStyleDefinition<NoInfer<Theme>>,
        'influenceResolvers'
    > & {
        influenceResolvers: {
            theme: {
                [Value in Theme]: TokenValue<
                    ModalTokens,
                    Omit<ModalInfluences<NoInfer<Theme>>, 'theme'>
                >;
            };
        };
    }
): ModalStyleDefinition<Theme> {
    return definition;
}
