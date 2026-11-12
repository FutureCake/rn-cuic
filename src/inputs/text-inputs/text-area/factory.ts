import type { UIComponentDescriptor } from '../../../core';
import type { StyleDefinitionShape } from '../../../providers-and-hooks/styles-manager/types';
import type { ThemeMode } from '../../button/types';
import { createTextArea } from './create-text-area';
import { textAreaStyleDefinition } from './styles';
import type { FeedbackVariant, TextAreaStyleDefinition } from './types';

/**
 * TextArea entry for core createUI. Call with no config for the preset
 * definition; a custom definition requires matching defaults.
 */
export function textAreaFactory(config?: {
    definition?: undefined;
    defaults?: { feedbackVariant: FeedbackVariant };
}): UIComponentDescriptor<
    typeof textAreaStyleDefinition,
    ThemeMode,
    ReturnType<typeof createTextArea<FeedbackVariant, ThemeMode>>
>;
export function textAreaFactory<
    Feedback extends string,
    Theme extends string,
>(config: {
    definition: TextAreaStyleDefinition<Feedback, Theme>;
    defaults: NoInfer<{ feedbackVariant: Feedback }>;
}): UIComponentDescriptor<
    TextAreaStyleDefinition<Feedback, Theme>,
    Theme,
    ReturnType<typeof createTextArea<Feedback, Theme>>
>;
export function textAreaFactory(config?: {
    definition?: TextAreaStyleDefinition<string, string>;
    defaults?: { feedbackVariant: string };
}): UIComponentDescriptor<StyleDefinitionShape, ThemeMode, unknown> {
    const definition: StyleDefinitionShape =
        config?.definition ?? textAreaStyleDefinition;
    const defaults = config?.defaults ?? { feedbackVariant: 'info' };
    return {
        definition,
        build: ({ useStyles, useTheme }) =>
            createTextArea<string, string>({
                defaults,
                useStyles: function useTextAreaStyles(options) {
                    return useStyles(options as never);
                },
                useTheme,
            }),
    };
}
