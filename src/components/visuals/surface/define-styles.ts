import type { TokenValue } from '../../../providers-and-hooks/styles-manager/types';
import type {
    SurfaceInfluences,
    SurfaceStyleDefinition,
    SurfaceTokens,
} from './types';

/** One value map; callbacks receive the other influences, never their own. */
type InfluenceValueMap<
    Values extends string,
    OwnKey extends keyof SurfaceInfluences,
    Variant extends string,
    Elevation extends string,
    Theme extends string,
> = {
    [Value in Values]: TokenValue<
        SurfaceTokens,
        Omit<SurfaceInfluences<Variant, Elevation, Theme>, OwnKey>
    >;
};

/**
 * The single authoring path for Surface style definitions. Supported variant,
 * elevation and theme names are inferred from the resolver maps; use an empty
 * entry (`neutral: {}`) for a name that needs no token overrides.
 */
export function defineSurfaceStyles<
    Variant extends string,
    Elevation extends string,
    Theme extends string,
>(
    definition: Omit<
        SurfaceStyleDefinition<
            NoInfer<Variant>,
            NoInfer<Elevation>,
            NoInfer<Theme>
        >,
        'influenceResolvers'
    > & {
        influenceResolvers: {
            variant: InfluenceValueMap<
                Variant,
                'variant',
                NoInfer<Variant>,
                NoInfer<Elevation>,
                NoInfer<Theme>
            >;
            elevation: InfluenceValueMap<
                Elevation,
                'elevation',
                NoInfer<Variant>,
                NoInfer<Elevation>,
                NoInfer<Theme>
            >;
            theme: InfluenceValueMap<
                Theme,
                'theme',
                NoInfer<Variant>,
                NoInfer<Elevation>,
                NoInfer<Theme>
            >;
        };
    }
): SurfaceStyleDefinition<Variant, Elevation, Theme> {
    return definition;
}
