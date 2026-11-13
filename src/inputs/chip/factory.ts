import type { UIComponentDescriptor } from '../../core';
import type { StyleDefinitionShape } from '../../providers-and-hooks/styles-manager/types';
import type { ThemeMode } from '../../utils/types';
import { createChip } from './create-chip';
import { chipStyleDefinition } from './styles';
import type { ChipSize, ChipStyleDefinition } from './types';

/**
 * Chip entry for core createUI. Call with no config for the preset
 * definition; a custom definition requires matching defaults.
 */
export function chipFactory(config?: {
    definition?: undefined;
    defaults?: { size: ChipSize };
}): UIComponentDescriptor<
    typeof chipStyleDefinition,
    ThemeMode,
    ReturnType<typeof createChip<ChipSize, ThemeMode>>
>;
export function chipFactory<
    Sizes extends string,
    Theme extends string,
>(config: {
    definition: ChipStyleDefinition<Sizes, Theme>;
    defaults: NoInfer<{ size: Sizes }>;
}): UIComponentDescriptor<
    ChipStyleDefinition<Sizes, Theme>,
    Theme,
    ReturnType<typeof createChip<Sizes, Theme>>
>;
export function chipFactory(config?: {
    definition?: ChipStyleDefinition<string, string>;
    defaults?: { size: string };
}): UIComponentDescriptor<StyleDefinitionShape, ThemeMode, unknown> {
    const definition: StyleDefinitionShape =
        config?.definition ?? chipStyleDefinition;
    const defaults = config?.defaults ?? { size: 'm' };
    return {
        definition,
        build: ({ useStyles, useTheme }) =>
            createChip<string, string>({
                defaults,
                useStyles: function useChipStyles(options) {
                    return useStyles(options as never);
                },
                useTheme,
            }),
    };
}
