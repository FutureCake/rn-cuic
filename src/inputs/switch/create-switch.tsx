import {
    Children,
    Fragment,
    isValidElement,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { hasSlot } from '../../utils/has-slot';
import { ContextProvider } from './context';
import { SwitchOption } from './slots/option';
import type {
    SwitchBuilderOptions,
    SwitchOptionData,
    SwitchProps,
} from './types';

const slideTiming = { duration: 300, easing: Easing.inOut(Easing.cubic) };
const crossfadeTiming = { duration: 400, easing: Easing.inOut(Easing.cubic) };

/** Structural only; visual styling belongs to the container/option slots. */
const optionsWrapperStyle = {
    width: '100%',
    flexDirection: 'row',
} as const;

/** Collect option metadata from Switch.Option children, through fragments. */
function collectOptions(children: ReactNode): SwitchOptionData<unknown>[] {
    const options: SwitchOptionData<unknown>[] = [];
    for (const child of Children.toArray(children)) {
        if (!isValidElement<{ children?: ReactNode }>(child)) continue;
        if (child.type === SwitchOption) {
            const { title, value } = child.props as SwitchOptionData<unknown>;
            options.push({ title, value });
        } else if (child.type === Fragment) {
            options.push(...collectOptions(child.props.children));
        }
    }
    return options;
}

/**
 * Bind shared behavior to the configured style hooks. The switch is
 * controlled: it renders the `value` prop and requests changes via `onChange`.
 */
export function createSwitch<Theme extends string>({
    useStyles,
    useTheme,
}: SwitchBuilderOptions<Theme>) {
    function SwitchRoot<Value>({
        options,
        value,
        onChange,
        theme: themeProp,
        disabled = false,
        style,
        styleOverrides,
        accessibilityRole = 'tablist',
        accessibilityState,
        children,
        ...props
    }: SwitchProps<Value, Theme>) {
        const { theme: ambientTheme } = useTheme();
        const theme = themeProp ?? ambientTheme;
        const { styles, tokens } = useStyles({
            influences: { theme },
            states: { disabled },
            overrides: {
                ...styleOverrides,
                container: [styleOverrides?.container, style],
            },
        });

        const slotted = hasSlot(children, SwitchOption);
        if (__DEV__ && slotted && options !== undefined) {
            console.warn(
                'Switch: both `options` and Switch.Option children were ' +
                    'supplied; the slots win and `options` is ignored.'
            );
        }
        const items = slotted ? collectOptions(children) : (options ?? []);
        const indexOf = (optionValue: unknown) => {
            const index = items.findIndex((item) => item.value === optionValue);
            return index === -1 ? 0 : index;
        };
        const settledIndex = indexOf(value);

        const left = useSharedValue(0);
        const width = useSharedValue(0);
        const selectedIndex = useSharedValue(0);
        const layouts = useRef<Array<{ x: number; width: number }>>([]);
        const settled = useRef(false);
        const [layoutVersion, setLayoutVersion] = useState(0);

        const indicatorStyle = useAnimatedStyle(() => ({
            left: left.value,
            width: width.value,
        }));

        useEffect(() => {
            const layout = layouts.current[settledIndex];
            if (layout === undefined) return;
            const targetLeft = layout.x + tokens.padding;
            if (!settled.current) {
                left.value = targetLeft;
                width.value = layout.width;
                selectedIndex.value = settledIndex;
                settled.current = true;
            } else {
                left.value = withTiming(targetLeft, slideTiming);
                width.value = withTiming(layout.width, slideTiming);
                selectedIndex.value = withTiming(settledIndex, crossfadeTiming);
            }
        }, [
            settledIndex,
            layoutVersion,
            tokens.padding,
            left,
            width,
            selectedIndex,
        ]);

        return (
            <ContextProvider
                value={{
                    styles,
                    tokens,
                    disabled,
                    selectedIndex,
                    settledIndex,
                    indexOf,
                    select: (optionValue) => onChange?.(optionValue as Value),
                    registerOption: (index, layout) => {
                        const previous = layouts.current[index];
                        if (
                            previous?.x === layout.x &&
                            previous?.width === layout.width
                        ) {
                            return;
                        }
                        layouts.current[index] = layout;
                        setLayoutVersion((version) => version + 1);
                    },
                }}
            >
                <Animated.View
                    {...props}
                    accessibilityRole={accessibilityRole}
                    accessibilityState={{ ...accessibilityState, disabled }}
                    style={styles.container}
                >
                    <Animated.View style={[indicatorStyle, styles.indicator]} />
                    <Animated.View style={optionsWrapperStyle}>
                        {slotted
                            ? children
                            : items.map((item, index) => (
                                  <SwitchOption
                                      key={index}
                                      title={item.title}
                                      value={item.value}
                                  />
                              ))}
                    </Animated.View>
                </Animated.View>
            </ContextProvider>
        );
    }

    return Object.assign(SwitchRoot, { Option: SwitchOption });
}
