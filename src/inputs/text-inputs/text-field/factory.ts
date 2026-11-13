import type { UIComponentDescriptor } from '../../../core';
import type { StyleDefinitionShape } from '../../../providers-and-hooks/styles-manager/types';
import type { ThemeMode } from '../../../utils/types';
import { createTextField } from './create-text-field';
import { textFieldStyleDefinition } from './styles';
import type { FeedbackVariant, TextFieldStyleDefinition } from './types';

/**
 * TextField entry for core createUI. Call with no config for the preset
 * definition; a custom definition requires matching defaults.
 */
export function textFieldFactory(config?: {
    definition?: undefined;
    defaults?: { feedbackVariant: FeedbackVariant };
}): UIComponentDescriptor<
    typeof textFieldStyleDefinition,
    ThemeMode,
    ReturnType<typeof createTextField<FeedbackVariant, ThemeMode>>
>;
export function textFieldFactory<
    Feedback extends string,
    Theme extends string,
>(config: {
    definition: TextFieldStyleDefinition<Feedback, Theme>;
    defaults: NoInfer<{ feedbackVariant: Feedback }>;
}): UIComponentDescriptor<
    TextFieldStyleDefinition<Feedback, Theme>,
    Theme,
    ReturnType<typeof createTextField<Feedback, Theme>>
>;
export function textFieldFactory(config?: {
    definition?: TextFieldStyleDefinition<string, string>;
    defaults?: { feedbackVariant: string };
}): UIComponentDescriptor<StyleDefinitionShape, ThemeMode, unknown> {
    const definition: StyleDefinitionShape =
        config?.definition ?? textFieldStyleDefinition;
    const defaults = config?.defaults ?? { feedbackVariant: 'info' };
    return {
        definition,
        build: ({ useStyles, useTheme }) =>
            createTextField<string, string>({
                defaults,
                useStyles: function useTextFieldStyles(options) {
                    return useStyles(options as never);
                },
                useTheme,
            }),
    };
}
