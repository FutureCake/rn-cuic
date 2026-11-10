import { createButton } from './inputs/button/create-button';
import type { ButtonStyleDefinition } from './inputs/button/types';
import { createToggle } from './inputs/toggle/create-toggle';
import type { ToggleStyleDefinition } from './inputs/toggle/types';
import { createStylesManager } from './providers-and-hooks/styles-manager';

/**
 * Create once at module scope. Returned components and hooks use this instance's
 * provider, not the library's default provider or another createUI instance.
 * Author definitions with defineButtonStyles/defineToggleStyles to infer names.
 */
export function createUI<
    Variant extends string,
    Size extends string,
    Theme extends string,
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
}) {
    const manager = createStylesManager(
        {
            Button: config.Button.definition,
            Toggle: config.Toggle.definition,
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
    return { Button, Toggle, ...manager };
}
