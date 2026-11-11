import { createButton } from './inputs/button/create-button';
import type { ButtonStyleDefinition } from './inputs/button/types';
import { createSwitch } from './inputs/switch/create-switch';
import type { SwitchStyleDefinition } from './inputs/switch/types';
import { createTextField } from './inputs/text-field/create-text-field';
import type { TextFieldStyleDefinition } from './inputs/text-field/types';
import { createToggle } from './inputs/toggle/create-toggle';
import type { ToggleStyleDefinition } from './inputs/toggle/types';
import { createStylesManager } from './providers-and-hooks/styles-manager';

/**
 * Create once at module scope. Returned components and hooks use this instance's
 * provider, not the library's default provider or another createUI instance.
 * Author definitions with the define*Styles helpers to infer names.
 */
export function createUI<
    Variant extends string,
    Size extends string,
    Theme extends string,
    FeedbackVariant extends string,
>(config: {
    /** Initial ambient theme for this instance's StylesProvider. */
    theme: NoInfer<Theme>;
    Button: {
        definition: ButtonStyleDefinition<Variant, Size, Theme>;
        defaults: NoInfer<{ variant: Variant; size: Size }>;
    };
    Toggle: {
        definition: ToggleStyleDefinition<NoInfer<Theme>>;
    };
    Switch: {
        definition: SwitchStyleDefinition<NoInfer<Theme>>;
    };
    TextField: {
        definition: TextFieldStyleDefinition<FeedbackVariant, NoInfer<Theme>>;
        defaults: NoInfer<{ feedbackVariant: FeedbackVariant }>;
    };
}) {
    const manager = createStylesManager(
        {
            Button: config.Button.definition,
            Toggle: config.Toggle.definition,
            Switch: config.Switch.definition,
            TextField: config.TextField.definition,
        },
        config.theme
    );
    const Button = createButton<Variant, Size, Theme>({
        defaults: config.Button.defaults,
        useStyles: function useButtonStyles(options) {
            return manager.useResolveComponentStyles('Button', options);
        },
        useTheme: manager.useTheme,
    });
    const Toggle = createToggle<Theme>({
        useStyles: function useToggleStyles(options) {
            return manager.useResolveComponentStyles('Toggle', options);
        },
        useTheme: manager.useTheme,
    });
    const Switch = createSwitch<Theme>({
        useStyles: function useSwitchStyles(options) {
            return manager.useResolveComponentStyles('Switch', options);
        },
        useTheme: manager.useTheme,
    });
    const TextField = createTextField<FeedbackVariant, Theme>({
        defaults: config.TextField.defaults,
        useStyles: function useTextFieldStyles(options) {
            return manager.useResolveComponentStyles('TextField', options);
        },
        useTheme: manager.useTheme,
    });
    return { Button, Toggle, Switch, TextField, ...manager };
}
