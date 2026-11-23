import {
    bottomSheetFactory,
    buttonFactory,
    chipFactory,
    chipsFactory,
    createUI,
    iconFactory,
    modalFactory,
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
    Icon,
    Modal,
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
        Icon: iconFactory(),
        Modal: modalFactory(),
        Toggle: toggleFactory(),
        Switch: switchFactory(),
        TextField: textFieldFactory(),
        TextArea: textAreaFactory(),
    },
});
