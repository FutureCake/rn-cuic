import {
    buttonFactory,
    chipFactory,
    createUI,
    switchFactory,
    textAreaFactory,
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
    TextArea,
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
        TextArea: textAreaFactory(),
    },
});
