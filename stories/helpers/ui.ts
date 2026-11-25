import {
    bottomSheetFactory,
    buttonFactory,
    chipFactory,
    chipsFactory,
    createUI,
    iconFactory,
    modalFactory,
    surfaceFactory,
    switchFactory,
    textAreaFactory,
    textFactory,
    textFieldFactory,
    toggleFactory,
} from 'rn-cuic';

/**
 * One preset family shared by all stories; mirrors a consumer's module-scope
 * call. No `fonts`: stories show the system-font default.
 */
export const {
    BottomSheet,
    Button,
    Chip,
    Chips,
    Icon,
    Modal,
    Surface,
    Toggle,
    Switch,
    Text,
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
        Icon: iconFactory(),
        Modal: modalFactory(),
        Surface: surfaceFactory(),
        Toggle: toggleFactory(),
        Switch: switchFactory(),
        Text: textFactory(),
        TextField: textFieldFactory(),
        TextArea: textAreaFactory(),
    },
});
