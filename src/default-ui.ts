import { createUI } from './create-ui';
import { buttonStyleDefinition } from './inputs/button/styles';
import { chipStyleDefinition } from './inputs/chip/styles';
import { switchStyleDefinition } from './inputs/switch/styles';
import { textFieldStyleDefinition } from './inputs/text-field/styles';
import { toggleStyleDefinition } from './inputs/toggle/styles';

/** Default preset; custom UI instances can provide their own definitions. */
export const componentStyles = {
    Button: buttonStyleDefinition,
    Chip: chipStyleDefinition,
    Toggle: toggleStyleDefinition,
    Switch: switchStyleDefinition,
    TextField: textFieldStyleDefinition,
};

export const {
    Button,
    Chip,
    Toggle,
    Switch,
    TextField,
    StylesProvider,
    useTheme,
    useResolveComponentStyles,
} = createUI({
    theme: 'light',
    Button: {
        definition: buttonStyleDefinition,
        defaults: { variant: 'primary', size: 'small' },
    },
    Chip: {
        definition: chipStyleDefinition,
        defaults: { size: 'm' },
    },
    Toggle: {
        definition: toggleStyleDefinition,
    },
    Switch: {
        definition: switchStyleDefinition,
    },
    TextField: {
        definition: textFieldStyleDefinition,
        defaults: { feedbackVariant: 'info' },
    },
});
