import { createUI } from './create-ui';
import { buttonStyleDefinition } from './inputs/button/styles';
import { toggleStyleDefinition } from './inputs/toggle/styles';

/** Default preset; custom UI instances can provide their own definitions. */
export const componentStyles = {
    Button: buttonStyleDefinition,
    Toggle: toggleStyleDefinition,
};

export const {
    Button,
    Toggle,
    StylesProvider,
    useTheme,
    useResolveComponentStyles,
} = createUI({
    theme: 'light',
    Button: {
        definition: buttonStyleDefinition,
        defaults: { variant: 'primary', size: 'small' },
    },
    Toggle: {
        definition: toggleStyleDefinition,
    },
});
