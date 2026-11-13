import type { UIComponentDescriptor } from '../../core';
import type { StyleDefinitionShape } from '../../providers-and-hooks/styles-manager/types';
import type { ThemeMode } from '../../utils/types';
import { createButton } from './create-button';
import { buttonStyleDefinition } from './styles';
import type { ButtonSize, ButtonStyleDefinition, ButtonVariant } from './types';

/**
 * Button entry for core createUI. Call with no config for the preset
 * definition; a custom definition requires matching defaults.
 */
export function buttonFactory(config?: {
    definition?: undefined;
    defaults?: { variant: ButtonVariant; size: ButtonSize };
}): UIComponentDescriptor<
    typeof buttonStyleDefinition,
    ThemeMode,
    ReturnType<typeof createButton<ButtonVariant, ButtonSize, ThemeMode>>
>;
export function buttonFactory<
    Variant extends string,
    Size extends string,
    Theme extends string,
>(config: {
    definition: ButtonStyleDefinition<Variant, Size, Theme>;
    defaults: NoInfer<{ variant: Variant; size: Size }>;
}): UIComponentDescriptor<
    ButtonStyleDefinition<Variant, Size, Theme>,
    Theme,
    ReturnType<typeof createButton<Variant, Size, Theme>>
>;
export function buttonFactory(config?: {
    definition?: ButtonStyleDefinition<string, string, string>;
    defaults?: { variant: string; size: string };
}): UIComponentDescriptor<StyleDefinitionShape, ThemeMode, unknown> {
    const definition: StyleDefinitionShape =
        config?.definition ?? buttonStyleDefinition;
    const defaults = config?.defaults ?? { variant: 'primary', size: 'small' };
    return {
        definition,
        build: ({ useStyles, useTheme }) =>
            createButton<string, string, string>({
                defaults,
                useStyles: function useButtonStyles(options) {
                    return useStyles(options as never);
                },
                useTheme,
            }),
    };
}
