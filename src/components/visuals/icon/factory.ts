import type { UIComponentDescriptor } from '../../../core';
import type { StyleDefinitionShape } from '../../../providers-and-hooks/styles-manager/types';
import type { ThemeMode } from '../../../shared/types';
import { createIcon } from './create-icon';
import { iconStyleDefinition } from './styles';
import type { IconSize, IconStyleDefinition } from './types';

/**
 * Icon entry for core createUI. Call with no config for the preset
 * definition; a custom definition requires matching defaults.
 */
export function iconFactory(config?: {
    definition?: undefined;
    defaults?: { size: IconSize };
}): UIComponentDescriptor<
    typeof iconStyleDefinition,
    ThemeMode,
    ReturnType<typeof createIcon<IconSize, ThemeMode>>
>;
export function iconFactory<
    Sizes extends string,
    Theme extends string,
>(config: {
    definition: IconStyleDefinition<Sizes, Theme>;
    defaults: NoInfer<{ size: Sizes }>;
}): UIComponentDescriptor<
    IconStyleDefinition<Sizes, Theme>,
    Theme,
    ReturnType<typeof createIcon<Sizes, Theme>>
>;
export function iconFactory(config?: {
    definition?: IconStyleDefinition<string, string>;
    defaults?: { size: string };
}): UIComponentDescriptor<StyleDefinitionShape, ThemeMode, unknown> {
    const definition: StyleDefinitionShape =
        config?.definition ?? iconStyleDefinition;
    const defaults = config?.defaults ?? { size: 'm' };
    return {
        definition,
        build: ({ useStyles, useTheme }) =>
            createIcon<string, string>({
                defaults,
                useStyles: function useIconStyles(options) {
                    return useStyles(options as never);
                },
                useTheme,
            }),
    };
}
