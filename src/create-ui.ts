import { createButton } from './inputs/button/create-button';
import type { ButtonStyleDefinition } from './inputs/button/types';
import { createStylesManager } from './providers-and-hooks/styles-manager';

/**
 * Create once at module scope. Returned components and hooks use this instance's
 * provider, not the library's default provider or another createUI instance.
 * Author definitions with defineButtonStyles to infer variant/size/theme names.
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
}) {
    const manager = createStylesManager(
        { Button: config.Button.definition },
        config.theme
    );
    const Button = createButton<Variant, Size, Theme>({
        defaults: config.Button.defaults,
        useStyles: function useButtonStyles(options) {
            return manager.useResolveComponentStyles('Button', options);
        },
        useTheme: manager.useTheme,
    });
    return { Button, ...manager };
}
