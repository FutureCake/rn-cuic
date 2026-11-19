import {
    bottomSheetFactory,
    buttonFactory,
    chipFactory,
    chipsFactory,
    createUI,
    switchFactory,
    textAreaFactory,
    textFieldFactory,
    toggleFactory,
} from 'rn-cuic';

/** One preset family shared by all stories; mirrors a consumer's module-scope call. */
export const {
    BottomSheet,
    Button,
    Chip,
    Chips,
    Toggle,
    Switch,
    TextField,
    TextArea,
    StylesProvider,
    useTheme,
} = createUI({
    theme: 'light',
    components: {
        BottomSheet: bottomSheetFactory(),
        Button: buttonFactory(),
        Chip: chipFactory(),
        Chips: chipsFactory(),
        Toggle: toggleFactory(),
        Switch: switchFactory(),
        TextField: textFieldFactory(),
        TextArea: textAreaFactory(),
    },
});
