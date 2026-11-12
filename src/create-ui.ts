import { createButton } from './inputs/button/create-button';
import { buttonStyleDefinition } from './inputs/button/styles';
import type {
    ButtonSize,
    ButtonStyleDefinition,
    ButtonVariant,
    ThemeMode,
} from './inputs/button/types';
import { createChip } from './inputs/chip/create-chip';
import { chipStyleDefinition } from './inputs/chip/styles';
import type { ChipSize, ChipStyleDefinition } from './inputs/chip/types';
import { createSwitch } from './inputs/switch/create-switch';
import { switchStyleDefinition } from './inputs/switch/styles';
import type { SwitchStyleDefinition } from './inputs/switch/types';
import { createTextField } from './inputs/text-field/create-text-field';
import { textFieldStyleDefinition } from './inputs/text-field/styles';
import type {
    FeedbackVariant,
    TextFieldStyleDefinition,
} from './inputs/text-field/types';
import { createToggle } from './inputs/toggle/create-toggle';
import { toggleStyleDefinition } from './inputs/toggle/styles';
import type { ToggleStyleDefinition } from './inputs/toggle/types';
import { createStylesManager } from './providers-and-hooks/styles-manager';
import type { StyleDefinitionShape } from './providers-and-hooks/styles-manager/types';

/** Preset style definitions, used when a selected component omits `definition`. */
export const componentStyles = {
    Button: buttonStyleDefinition,
    Chip: chipStyleDefinition,
    Toggle: toggleStyleDefinition,
    Switch: switchStyleDefinition,
    TextField: textFieldStyleDefinition,
};

type ComponentKey = 'Button' | 'Chip' | 'Toggle' | 'Switch' | 'TextField';

/**
 * Selection config: a component is built only when its key is present.
 * `{}` selects the preset definition; a custom `definition` requires matching
 * `defaults`. Preset fallbacks resolve the light/dark themes only, so supply
 * definitions for every selected component when using a custom theme union.
 */
export type UIConfig<
    Variant extends string,
    Size extends string,
    Theme extends string,
    Feedback extends string,
    ChipSizes extends string,
> = {
    /** Initial ambient theme for this instance's StylesProvider. */
    theme: NoInfer<Theme>;
    Button?:
        | {
              definition?: undefined;
              defaults?: { variant: ButtonVariant; size: ButtonSize };
          }
        | {
              definition: ButtonStyleDefinition<Variant, Size, Theme>;
              defaults: NoInfer<{ variant: Variant; size: Size }>;
          };
    Chip?:
        | { definition?: undefined; defaults?: { size: ChipSize } }
        | {
              definition: ChipStyleDefinition<ChipSizes, Theme>;
              defaults: NoInfer<{ size: ChipSizes }>;
          };
    Toggle?: { definition?: ToggleStyleDefinition<Theme> };
    Switch?: { definition?: SwitchStyleDefinition<Theme> };
    TextField?:
        | {
              definition?: undefined;
              defaults?: { feedbackVariant: FeedbackVariant };
          }
        | {
              definition: TextFieldStyleDefinition<Feedback, Theme>;
              defaults: NoInfer<{ feedbackVariant: Feedback }>;
          };
};

type ComponentDefinitions<
    Variant extends string,
    Size extends string,
    Theme extends string,
    Feedback extends string,
    ChipSizes extends string,
> = {
    Button: ButtonStyleDefinition<Variant, Size, Theme>;
    Chip: ChipStyleDefinition<ChipSizes, Theme>;
    Toggle: ToggleStyleDefinition<Theme>;
    Switch: SwitchStyleDefinition<Theme>;
    TextField: TextFieldStyleDefinition<Feedback, Theme>;
};

type BuiltComponents<
    Variant extends string,
    Size extends string,
    Theme extends string,
    Feedback extends string,
    ChipSizes extends string,
> = {
    Button: ReturnType<typeof createButton<Variant, Size, Theme>>;
    Chip: ReturnType<typeof createChip<ChipSizes, Theme>>;
    Toggle: ReturnType<typeof createToggle<Theme>>;
    Switch: ReturnType<typeof createSwitch<Theme>>;
    TextField: ReturnType<typeof createTextField<Feedback, Theme>>;
};

/** The selected components plus the instance's provider and hooks. */
export type UI<
    Config,
    Variant extends string,
    Size extends string,
    Theme extends string,
    Feedback extends string,
    ChipSizes extends string,
> = Pick<
    BuiltComponents<Variant, Size, Theme, Feedback, ChipSizes>,
    Extract<keyof Config, ComponentKey>
> &
    ReturnType<
        typeof createStylesManager<
            Pick<
                ComponentDefinitions<Variant, Size, Theme, Feedback, ChipSizes>,
                Extract<keyof Config, ComponentKey>
            >,
            Theme
        >
    >;

/**
 * Create once at module scope, selecting only the components the app uses.
 * Returned components and hooks use this instance's provider, not another
 * createUI instance's. Author definitions with the define*Styles helpers.
 */
export function createUI<
    Variant extends string = ButtonVariant,
    Size extends string = ButtonSize,
    Theme extends string = ThemeMode,
    Feedback extends string = FeedbackVariant,
    ChipSizes extends string = ChipSize,
    Config extends UIConfig<Variant, Size, Theme, Feedback, ChipSizes> =
        UIConfig<Variant, Size, Theme, Feedback, ChipSizes>,
>(
    config: Config & UIConfig<Variant, Size, Theme, Feedback, ChipSizes>
): UI<Config, Variant, Size, Theme, Feedback, ChipSizes>;
export function createUI(
    config: UIConfig<string, string, string, string, string>
): unknown {
    const definitions: Record<string, StyleDefinitionShape> = {};
    if (config.Button) {
        definitions.Button = config.Button.definition ?? buttonStyleDefinition;
    }
    if (config.Chip) {
        definitions.Chip = config.Chip.definition ?? chipStyleDefinition;
    }
    if (config.Toggle) {
        definitions.Toggle = config.Toggle.definition ?? toggleStyleDefinition;
    }
    if (config.Switch) {
        definitions.Switch = config.Switch.definition ?? switchStyleDefinition;
    }
    if (config.TextField) {
        definitions.TextField =
            config.TextField.definition ?? textFieldStyleDefinition;
    }
    const manager = createStylesManager(definitions, config.theme);
    const ui: Record<string, unknown> = { ...manager };
    if (config.Button) {
        ui.Button = createButton<string, string, string>({
            defaults: config.Button.defaults ?? {
                variant: 'primary',
                size: 'small',
            },
            useStyles: function useButtonStyles(options) {
                return manager.useResolveComponentStyles(
                    'Button',
                    options as never
                );
            },
            useTheme: manager.useTheme,
        });
    }
    if (config.Chip) {
        ui.Chip = createChip<string, string>({
            defaults: config.Chip.defaults ?? { size: 'm' },
            useStyles: function useChipStyles(options) {
                return manager.useResolveComponentStyles(
                    'Chip',
                    options as never
                );
            },
            useTheme: manager.useTheme,
        });
    }
    if (config.Toggle) {
        ui.Toggle = createToggle<string>({
            useStyles: function useToggleStyles(options) {
                return manager.useResolveComponentStyles(
                    'Toggle',
                    options as never
                );
            },
            useTheme: manager.useTheme,
        });
    }
    if (config.Switch) {
        ui.Switch = createSwitch<string>({
            useStyles: function useSwitchStyles(options) {
                return manager.useResolveComponentStyles(
                    'Switch',
                    options as never
                );
            },
            useTheme: manager.useTheme,
        });
    }
    if (config.TextField) {
        ui.TextField = createTextField<string, string>({
            defaults: config.TextField.defaults ?? {
                feedbackVariant: 'info',
            },
            useStyles: function useTextFieldStyles(options) {
                return manager.useResolveComponentStyles(
                    'TextField',
                    options as never
                );
            },
            useTheme: manager.useTheme,
        });
    }
    return ui;
}
