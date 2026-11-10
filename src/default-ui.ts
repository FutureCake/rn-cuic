import { createUI } from './create-ui';
import { buttonStyleDefinition } from './inputs/button/styles';

/** Default preset; custom UI instances can provide their own definitions. */
export const componentStyles = { Button: buttonStyleDefinition };

export const { Button, StylesProvider, useTheme, useResolveComponentStyles } =
    createUI({
        theme: 'light',
        Button: {
            definition: buttonStyleDefinition,
            defaults: { variant: 'primary', size: 'small' },
        },
    });
