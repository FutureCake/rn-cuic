import type { UIComponentDescriptor } from '../../core';
import type { StyleDefinitionShape } from '../../providers-and-hooks/styles-manager/types';
import type { ThemeMode } from '../../utils/types';
import { createToggle } from './create-toggle';
import { toggleStyleDefinition } from './styles';
import type { ToggleStyleDefinition } from './types';

/** Toggle entry for core createUI; omit the definition for the preset. */
export function toggleFactory<Theme extends string = ThemeMode>(config?: {
    definition?: ToggleStyleDefinition<Theme>;
}): UIComponentDescriptor<
    ToggleStyleDefinition<Theme>,
    Theme,
    ReturnType<typeof createToggle<Theme>>
>;
export function toggleFactory(config?: {
    definition?: StyleDefinitionShape;
}): UIComponentDescriptor<StyleDefinitionShape, string, unknown> {
    const definition = config?.definition ?? toggleStyleDefinition;
    return {
        definition,
        build: ({ useStyles, useTheme }) =>
            createToggle<string>({
                useStyles: function useToggleStyles(options) {
                    return useStyles(options as never);
                },
                useTheme,
            }),
    };
}
