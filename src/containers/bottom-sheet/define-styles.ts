import type { TokenValue } from '../../providers-and-hooks/styles-manager/types';
import type {
    BottomSheetInfluences,
    BottomSheetStyleDefinition,
    BottomSheetTokens,
} from './types';

/**
 * The single authoring path for BottomSheet style definitions. Supported
 * theme names are inferred from the resolver map; use an empty entry
 * (`day: {}`) for a name that needs no token overrides.
 */
export function defineBottomSheetStyles<Theme extends string>(
    definition: Omit<
        BottomSheetStyleDefinition<NoInfer<Theme>>,
        'influenceResolvers'
    > & {
        influenceResolvers: {
            theme: {
                [Value in Theme]: TokenValue<
                    BottomSheetTokens,
                    Omit<BottomSheetInfluences<NoInfer<Theme>>, 'theme'>
                >;
            };
        };
    }
): BottomSheetStyleDefinition<Theme> {
    return definition;
}
