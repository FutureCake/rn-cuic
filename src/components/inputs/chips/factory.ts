import type { UIComponentDescriptor } from '../../../core';
import type { StyleDefinitionShape } from '../../../providers-and-hooks/styles-manager/types';
import type { ThemeMode } from '../../../shared/types';
import { createChips } from './create-chips';
import { chipsStyleDefinition } from './styles';
import type {
    ChipsLayout,
    ChipsStyleDefinition,
    FeedbackVariant,
} from './types';

/**
 * Chips entry for core createUI. Call with no config for the preset
 * definition; a custom definition requires matching defaults.
 */
export function chipsFactory(config?: {
    definition?: undefined;
    defaults?: { layout: ChipsLayout; feedbackVariant: FeedbackVariant };
}): UIComponentDescriptor<
    typeof chipsStyleDefinition,
    ThemeMode,
    ReturnType<typeof createChips<FeedbackVariant, ThemeMode>>
>;
export function chipsFactory<
    Variant extends string,
    Theme extends string,
>(config: {
    definition: ChipsStyleDefinition<Variant, Theme>;
    defaults: NoInfer<{ layout: ChipsLayout; feedbackVariant: Variant }>;
}): UIComponentDescriptor<
    ChipsStyleDefinition<Variant, Theme>,
    Theme,
    ReturnType<typeof createChips<Variant, Theme>>
>;
export function chipsFactory(config?: {
    definition?: ChipsStyleDefinition<string, string>;
    defaults?: { layout: ChipsLayout; feedbackVariant: string };
}): UIComponentDescriptor<StyleDefinitionShape, ThemeMode, unknown> {
    const definition: StyleDefinitionShape =
        config?.definition ?? chipsStyleDefinition;
    const defaults = config?.defaults ?? {
        layout: 'wrap' as ChipsLayout,
        feedbackVariant: 'info',
    };
    return {
        definition,
        build: ({ useStyles, useTheme }) =>
            createChips<string, string>({
                defaults,
                useStyles: function useChipsStyles(options) {
                    return useStyles(options as never);
                },
                useTheme,
            }),
    };
}
