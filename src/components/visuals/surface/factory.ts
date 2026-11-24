import type { UIComponentDescriptor } from '../../../core';
import type { StyleDefinitionShape } from '../../../providers-and-hooks/styles-manager/types';
import type { ThemeMode } from '../../../shared/types';
import { createSurface } from './create-surface';
import { surfaceStyleDefinition } from './styles';
import type {
    SurfaceElevation,
    SurfaceStyleDefinition,
    SurfaceVariant,
} from './types';

/**
 * Surface entry for core createUI. Call with no config for the preset
 * definition; a custom definition requires matching defaults.
 */
export function surfaceFactory(config?: {
    definition?: undefined;
    defaults?: { variant: SurfaceVariant; elevation: SurfaceElevation };
}): UIComponentDescriptor<
    typeof surfaceStyleDefinition,
    ThemeMode,
    ReturnType<
        typeof createSurface<SurfaceVariant, SurfaceElevation, ThemeMode>
    >
>;
export function surfaceFactory<
    Variants extends string,
    Elevations extends string,
    Theme extends string,
>(config: {
    definition: SurfaceStyleDefinition<Variants, Elevations, Theme>;
    defaults: NoInfer<{ variant: Variants; elevation: Elevations }>;
}): UIComponentDescriptor<
    SurfaceStyleDefinition<Variants, Elevations, Theme>,
    Theme,
    ReturnType<typeof createSurface<Variants, Elevations, Theme>>
>;
export function surfaceFactory(config?: {
    definition?: SurfaceStyleDefinition<string, string, string>;
    defaults?: { variant: string; elevation: string };
}): UIComponentDescriptor<StyleDefinitionShape, ThemeMode, unknown> {
    const definition: StyleDefinitionShape =
        config?.definition ?? surfaceStyleDefinition;
    const defaults = config?.defaults ?? {
        variant: 'neutral',
        elevation: 'ground',
    };
    return {
        definition,
        build: ({ useStyles, useTheme }) =>
            createSurface<string, string, string>({
                defaults,
                useStyles: function useSurfaceStyles(options) {
                    return useStyles(options as never);
                },
                useTheme,
            }),
    };
}
