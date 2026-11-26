import { buttonFactory } from '../../components/inputs/button';
import { chipFactory } from '../../components/inputs/chip';
import { chipsFactory } from '../../components/inputs/chips';
import { switchFactory } from '../../components/inputs/switch';
import { textAreaFactory } from '../../components/inputs/text-inputs/text-area';
import { textFieldFactory } from '../../components/inputs/text-inputs/text-field';
import { toggleFactory } from '../../components/inputs/toggle';
import { bottomSheetFactory } from '../../components/overlays/bottom-sheet';
import { modalFactory } from '../../components/overlays/modal';
import { iconFactory } from '../../components/visuals/icon';
import { surfaceFactory } from '../../components/visuals/surface';
import { textFactory } from '../../components/visuals/text';
import { createUI } from '../../core';

// Layout primitives need no createUI registration; re-exported so this entry
// covers every component.
export * from '../../components/layouts/box';
export * from '../../components/layouts/stacks';

// Style constants: colors, spacings, and radii.
export * from './style-consts';

/**
 * Ready-made family: every component with its preset definition, the system
 * font and a light initial theme. Wrap the app in this StylesProvider (its
 * `styles` and `theme` props still apply). For custom definitions, fonts, or
 * a smaller bundle, call createUI from 'rn-cuic/core' instead.
 */
export const {
    BottomSheet,
    Button,
    Chip,
    Chips,
    Icon,
    Modal,
    Surface,
    Switch,
    Text,
    TextArea,
    TextField,
    Toggle,
    StylesProvider,
    useTheme,
    useResolveComponentStyles,
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
        Switch: switchFactory(),
        Text: textFactory(),
        TextArea: textAreaFactory(),
        TextField: textFieldFactory(),
        Toggle: toggleFactory(),
    },
});
