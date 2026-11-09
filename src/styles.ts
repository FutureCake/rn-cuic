import { createUI } from './create-ui';
import { buttonStyleDefinition } from './inputs/button/styles';

/** Default preset; custom UI instances can provide their own definitions. */
export const componentStyles = { Button: buttonStyleDefinition };

export const { Button, StylesProvider, useResolveComponentStyles } = createUI({
    Button: {
        definition: componentStyles.Button,
        defaults: { variant: 'primary', size: 'small', theme: 'light' },
    },
});
