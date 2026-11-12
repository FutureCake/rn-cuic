import {
    buttonFactory,
    chipFactory,
    createUI,
    switchFactory,
    textFieldFactory,
    toggleFactory,
} from 'rn-cuic';

/** One preset family shared by all stories; mirrors a consumer's module-scope call. */
export const {
    Button,
    Chip,
    Toggle,
    Switch,
    TextField,
    StylesProvider,
    useTheme,
} = createUI({
    theme: 'light',
    components: {
        Button: buttonFactory(),
        Chip: chipFactory(),
        Toggle: toggleFactory(),
        Switch: switchFactory(),
        TextField: textFieldFactory(),
    },
});
