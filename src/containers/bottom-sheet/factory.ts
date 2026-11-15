import type { UIComponentDescriptor } from '../../core';
import type { StyleDefinitionShape } from '../../providers-and-hooks/styles-manager/types';
import type { ThemeMode } from '../../utils/types';
import { createBottomSheet } from './create-bottom-sheet';
import { bottomSheetStyleDefinition } from './styles';
import type { BottomSheetStyleDefinition } from './types';

/** BottomSheet entry for core createUI; omit the definition for the preset. */
export function bottomSheetFactory<Theme extends string = ThemeMode>(config?: {
    definition?: BottomSheetStyleDefinition<Theme>;
}): UIComponentDescriptor<
    BottomSheetStyleDefinition<Theme>,
    Theme,
    ReturnType<typeof createBottomSheet<Theme>>
>;
export function bottomSheetFactory(config?: {
    definition?: StyleDefinitionShape;
}): UIComponentDescriptor<StyleDefinitionShape, string, unknown> {
    const definition = config?.definition ?? bottomSheetStyleDefinition;
    return {
        definition,
        build: ({ useStyles, useTheme }) =>
            createBottomSheet<string>({
                useStyles: function useBottomSheetStyles(options) {
                    return useStyles(options as never);
                },
                useTheme,
            }),
    };
}
