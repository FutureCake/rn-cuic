import type { UIComponentDescriptor } from '../../../core';
import type { StyleDefinitionShape } from '../../../providers-and-hooks/styles-manager/types';
import type { ThemeMode } from '../../../shared/types';
import { createModal } from './create-modal';
import { modalStyleDefinition } from './styles';
import type { ModalStyleDefinition } from './types';

/** Modal entry for core createUI; omit the definition for the preset. */
export function modalFactory<Theme extends string = ThemeMode>(config?: {
    definition?: ModalStyleDefinition<Theme>;
}): UIComponentDescriptor<
    ModalStyleDefinition<Theme>,
    Theme,
    ReturnType<typeof createModal<Theme>>
>;
export function modalFactory(config?: {
    definition?: StyleDefinitionShape;
}): UIComponentDescriptor<StyleDefinitionShape, string, unknown> {
    const definition = config?.definition ?? modalStyleDefinition;
    return {
        definition,
        build: ({ useStyles, useTheme }) =>
            createModal<string>({
                useStyles: function useModalStyles(options) {
                    return useStyles(options as never);
                },
                useTheme,
            }),
    };
}
