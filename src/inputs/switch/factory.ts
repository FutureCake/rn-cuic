import type { UIComponentDescriptor } from '../../core';
import type { StyleDefinitionShape } from '../../providers-and-hooks/styles-manager/types';
import type { ThemeMode } from '../../utils/types';
import { createSwitch } from './create-switch';
import { switchStyleDefinition } from './styles';
import type { SwitchStyleDefinition } from './types';

/** Switch entry for core createUI; omit the definition for the preset. */
export function switchFactory<Theme extends string = ThemeMode>(config?: {
    definition?: SwitchStyleDefinition<Theme>;
}): UIComponentDescriptor<
    SwitchStyleDefinition<Theme>,
    Theme,
    ReturnType<typeof createSwitch<Theme>>
>;
export function switchFactory(config?: {
    definition?: StyleDefinitionShape;
}): UIComponentDescriptor<StyleDefinitionShape, string, unknown> {
    const definition = config?.definition ?? switchStyleDefinition;
    return {
        definition,
        build: ({ useStyles, useTheme }) =>
            createSwitch<string>({
                useStyles: function useSwitchStyles(options) {
                    return useStyles(options as never);
                },
                useTheme,
            }),
    };
}
