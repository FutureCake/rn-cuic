import { describe, expect, it, jest } from '@jest/globals';
import {
    buttonStyleDefinition,
    defineButtonStyles,
    resolveComponentStyles,
    type ButtonStyleDefinition,
} from '../index';

describe('generic Button style resolution', () => {
    it('preserves influence order, callback contexts, state maps and overrides', () => {
        const sizeCallback = jest.fn(
            ({ variant }: { variant: 'solid' | 'outline'; theme: 'day' }) => ({
                fontSize: variant === 'solid' ? 18 : 20,
            })
        );
        const definition = defineButtonStyles({
            defaultTokens: buttonStyleDefinition.defaultTokens,
            slotStyles: buttonStyleDefinition.slotStyles,
            influenceOrder: ['theme', 'variant', 'size'],
            stateOrder: ['pressed', 'disabled'],
            influenceResolvers: {
                variantResolver: { solid: { fontSize: 15 }, outline: {} },
                sizeResolver: { compact: sizeCallback },
                themeResolver: { day: { fontSize: 12 } },
            },
            stateResolvers: {
                pressed: { solid: { fontSize: 21 }, compact: { fontSize: 22 } },
                disabled: { fontSize: 23 },
            },
            transition: { transitionDuration: 100 },
        });
        const influencers = {
            variant: 'solid',
            size: 'compact',
            theme: 'day',
        } as const;
        const result = resolveComponentStyles(definition, {
            influencers,
            states: { pressed: true },
            overrides: { text: { fontSize: 50 } },
        });
        expect(sizeCallback).toHaveBeenCalledWith({
            variant: 'solid',
            theme: 'day',
        });
        expect(result.tokens.fontSize).toBe(22);
        expect(result.styles.text).toEqual([
            expect.objectContaining({ fontSize: 22, transitionDuration: 100 }),
            { fontSize: 50 },
        ]);
        expect(
            resolveComponentStyles(definition, {
                influencers,
                states: { pressed: true, disabled: true },
            }).tokens.fontSize
        ).toBe(23);
        expect(definition.defaultTokens.fontSize).toBe(0);
    });

    it('supports explicitly typed sparse definitions and state callbacks', () => {
        const definition: ButtonStyleDefinition<
            'quiet' | 'loud',
            'one',
            'brand'
        > = {
            defaultTokens: buttonStyleDefinition.defaultTokens,
            slotStyles: buttonStyleDefinition.slotStyles,
            influenceResolvers: {},
            stateResolvers: {
                pressed: ({ variant, size, theme }) => ({
                    fontSize:
                        variant === 'loud' &&
                        size === 'one' &&
                        theme === 'brand'
                            ? 30
                            : 10,
                }),
            },
        };
        expect(
            resolveComponentStyles(definition, {
                influencers: { variant: 'loud', size: 'one', theme: 'brand' },
                states: { pressed: true },
            }).tokens.fontSize
        ).toBe(30);
    });
});
