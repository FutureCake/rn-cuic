import type { UIComponentDescriptor } from '../../../core';
import type { StyleDefinitionShape } from '../../../providers-and-hooks/styles-manager/types';
import type { ThemeMode } from '../../../shared/types';
import { createButton } from './create-button';
import { buttonStyleDefinition } from './styles';
import type {
    ButtonShape,
    ButtonSize,
    ButtonStyleDefinition,
    ButtonVariant,
} from './types';

/**
 * Button entry for core createUI. Call with no config for the preset
 * definition; a custom definition requires matching defaults.
 */
export function buttonFactory(config?: {
    definition?: undefined;
    defaults?: { variant: ButtonVariant; shape: ButtonShape; size: ButtonSize };
}): UIComponentDescriptor<
    typeof buttonStyleDefinition,
    ThemeMode,
    ReturnType<
        typeof createButton<ButtonVariant, ButtonShape, ButtonSize, ThemeMode>
    >
>;
export function buttonFactory<
    Variant extends string,
    Shape extends string,
    Size extends string,
    Theme extends string,
>(config: {
    definition: ButtonStyleDefinition<Variant, Shape, Size, Theme>;
    defaults: NoInfer<{ variant: Variant; shape: Shape; size: Size }>;
}): UIComponentDescriptor<
    ButtonStyleDefinition<Variant, Shape, Size, Theme>,
    Theme,
    ReturnType<typeof createButton<Variant, Shape, Size, Theme>>
>;
export function buttonFactory(config?: {
    definition?: ButtonStyleDefinition<string, string, string, string>;
    defaults?: { variant: string; shape: string; size: string };
}): UIComponentDescriptor<StyleDefinitionShape, ThemeMode, unknown> {
    const definition: StyleDefinitionShape =
        config?.definition ?? buttonStyleDefinition;
    const defaults = config?.defaults ?? {
        variant: 'solid',
        shape: 'block',
        size: 'm',
    };
    return {
        definition,
        build: ({ useStyles, useTheme }) =>
            createButton<string, string, string, string>({
                defaults,
                useStyles: function useButtonStyles(options) {
                    return useStyles(options as never);
                },
                useTheme,
            }),
    };
}
