import type { UIComponentDescriptor } from '../../../core';
import type { StyleDefinitionShape } from '../../../providers-and-hooks/styles-manager/types';
import type { ThemeMode } from '../../../shared/types';
import { createText } from './create-text';
import { textStyleDefinition } from './styles';
import type { TextStyleDefinition, TextVariant, TextWeight } from './types';

/**
 * Text entry for core createUI. Call with no config for the preset type
 * scale; a custom definition requires matching defaults.
 */
export function textFactory(config?: {
    definition?: undefined;
    defaults?: { variant: TextVariant };
}): UIComponentDescriptor<
    typeof textStyleDefinition,
    ThemeMode,
    ReturnType<typeof createText<TextVariant, TextWeight, ThemeMode>>
>;
export function textFactory<
    Variants extends string,
    Weights extends string,
    Theme extends string,
>(config: {
    definition: TextStyleDefinition<Variants, Weights, Theme>;
    defaults: NoInfer<{ variant: Variants }>;
}): UIComponentDescriptor<
    TextStyleDefinition<Variants, Weights, Theme>,
    Theme,
    ReturnType<typeof createText<Variants, Weights, Theme>>
>;
export function textFactory(config?: {
    definition?: TextStyleDefinition<string, string, string>;
    defaults?: { variant: string };
}): UIComponentDescriptor<StyleDefinitionShape, ThemeMode, unknown> {
    const definition: StyleDefinitionShape =
        config?.definition ?? textStyleDefinition;
    const defaults = config?.defaults ?? { variant: 'body' };
    return {
        definition,
        build: ({ useStyles, useTheme }) =>
            createText<string, string, string>({
                defaults,
                useStyles: function useTextStyles(options) {
                    return useStyles(options as never);
                },
                useTheme,
            }),
    };
}
