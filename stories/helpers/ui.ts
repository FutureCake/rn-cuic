import { createUI } from 'rn-cuic';

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
    Button: {},
    Chip: {},
    Toggle: {},
    Switch: {},
    TextField: {},
});
