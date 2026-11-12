import { useState } from 'react';
import Animated from 'react-native-reanimated';
import { hasSlot } from '../../utils/has-slot';
import { ContextProvider } from './context';
import { TextAreaFeedback } from './slots/feedback';
import { TextAreaHeader } from './slots/header';
import { TextAreaInput } from './slots/input';
import type {
    TextAreaBuilderOptions,
    TextAreaProps,
    ValidationResult,
} from './types';

/**
 * Bind shared behavior to the configured defaults and style hooks; the slot
 * parts are shared and resolve the nearest TextArea root's context.
 */
export function createTextArea<Variant extends string, Theme extends string>({
    defaults,
    useStyles,
    useTheme,
}: TextAreaBuilderOptions<Variant, Theme>) {
    function TextAreaRoot({
        theme: themeProp,
        disabled = false,
        numLines = 4,
        grow = false,
        maxLines,
        header,
        feedback,
        validation,
        style,
        styleOverrides,
        accessibilityState,
        children,
        onChangeText,
        onFocus,
        onBlur,
        ...props
    }: TextAreaProps<Variant, Theme>) {
        const { theme: ambientTheme } = useTheme();
        const theme = themeProp ?? ambientTheme;
        const [focused, setFocused] = useState(false);
        const [hasBlurred, setHasBlurred] = useState(false);
        const [validationResult, setValidationResult] = useState<
            ValidationResult<Variant> | undefined
        >(undefined);
        /** One line of the input's font, measured from the hidden probe. */
        const [measuredLineHeight, setMeasuredLineHeight] = useState<
            number | undefined
        >(undefined);
        /** Height of the hidden mirror text, measured via onLayout. */
        const [contentHeight, setContentHeight] = useState<number | undefined>(
            undefined
        );
        /** Mirror of the input's text for uncontrolled usage. */
        const [internalText, setInternalText] = useState(
            () => props.value ?? props.defaultValue ?? ''
        );
        const text = props.value ?? internalText;

        const activeValidation =
            validation !== undefined &&
            validationResult !== undefined &&
            !validationResult.valid &&
            (validation.showFeedbackOn === 'change' || hasBlurred)
                ? validationResult
                : undefined;
        const feedbackProp =
            typeof feedback === 'string' ? { message: feedback } : feedback;
        const variant =
            activeValidation?.variant ??
            feedbackProp?.variant ??
            defaults.feedbackVariant;
        const validationMessage = activeValidation?.message;

        const { styles, tokens } = useStyles({
            influences: { feedbackVariant: variant, theme },
            states: { focused: focused && !disabled, disabled },
            overrides: {
                ...styleOverrides,
                container: [styleOverrides?.container, style],
            },
        });

        // Height in whole lines; the probe measurement falls back to an
        // estimate for the frames before the first layout pass. Content is
        // measured from a hidden mirror of the text (iOS Fabric does not emit
        // onContentSizeChange while the input has a fixed height).
        const lineHeight = measuredLineHeight ?? tokens.fontSize * 1.4;
        const growEnabled = grow || maxLines !== undefined;
        let lines = numLines;
        if (growEnabled && contentHeight !== undefined) {
            lines = Math.max(numLines, Math.round(contentHeight / lineHeight));
            if (maxLines !== undefined) {
                lines = Math.min(lines, maxLines);
            }
        }
        const inputHeight =
            lines * lineHeight + 2 * tokens.paddingY + 2 * tokens.borderWidth;

        return (
            <ContextProvider
                value={{
                    styles,
                    tokens,
                    inputHeight,
                    inputProps: {
                        ...props,
                        multiline: true,
                        editable: !disabled,
                        accessibilityState: { ...accessibilityState, disabled },
                        placeholderTextColor: tokens.placeholderColor,
                        onChangeText: (next) => {
                            setInternalText(next);
                            onChangeText?.(next);
                            if (!validation) return;
                            const result = validation.validator(next);
                            setValidationResult(result);
                            validation.onValidation?.(result);
                        },
                        onFocus: (event) => {
                            setFocused(true);
                            onFocus?.(event);
                        },
                        onBlur: (event) => {
                            setFocused(false);
                            setHasBlurred(true);
                            onBlur?.(event);
                        },
                    },
                    validationMessage,
                    message: validationMessage ?? feedbackProp?.message,
                    variant,
                }}
            >
                <Animated.View style={styles.container}>
                    {/* Invisible probe: one line of the input's font. */}
                    <Animated.Text
                        accessibilityElementsHidden
                        importantForAccessibility="no-hide-descendants"
                        numberOfLines={1}
                        onLayout={(event) =>
                            setMeasuredLineHeight(
                                event.nativeEvent.layout.height
                            )
                        }
                        style={{
                            position: 'absolute',
                            opacity: 0,
                            pointerEvents: 'none',
                            fontFamily: tokens.fontFamily,
                            fontSize: tokens.fontSize,
                        }}
                    >
                        Ag
                    </Animated.Text>
                    {/* Invisible mirror: the input's text at its content
                        width; its layout height drives growth. The zero-width
                        space keeps a trailing newline measurable. */}
                    {growEnabled && (
                        <Animated.Text
                            accessibilityElementsHidden
                            importantForAccessibility="no-hide-descendants"
                            onLayout={(event) =>
                                setContentHeight(
                                    event.nativeEvent.layout.height
                                )
                            }
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: tokens.borderWidth,
                                right: tokens.borderWidth,
                                paddingHorizontal: tokens.paddingX,
                                opacity: 0,
                                pointerEvents: 'none',
                                fontFamily: tokens.fontFamily,
                                fontSize: tokens.fontSize,
                            }}
                        >
                            {text}
                            {'\u200B'}
                        </Animated.Text>
                    )}
                    {header !== undefined &&
                        !hasSlot(children, TextAreaHeader) && (
                            <TextAreaHeader>{header}</TextAreaHeader>
                        )}
                    {children}
                    {!hasSlot(children, TextAreaInput) && <TextAreaInput />}
                    {!hasSlot(children, TextAreaFeedback) && (
                        <TextAreaFeedback>
                            {feedbackProp?.message}
                        </TextAreaFeedback>
                    )}
                </Animated.View>
            </ContextProvider>
        );
    }

    return Object.assign(TextAreaRoot, {
        Header: TextAreaHeader,
        Input: TextAreaInput,
        Feedback: TextAreaFeedback,
    });
}
