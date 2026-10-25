import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { CSSTransitionProperties } from 'react-native-reanimated';
import type { StyleOverrides } from '../../utils/types';

/** Type-only metadata preserves each definition's contract through a collection. */
declare const styleDefinitionContract: unique symbol;

/** Static token overrides or a callback with the supplied influence context. */
export type TokenValue<Tokens extends object, Influences extends object> =
    Partial<Tokens> | ((influences: Influences) => Partial<Tokens>);

/** Generates per-value resolvers whose callbacks exclude their own influence. */
export type TokenResolvers<
    Influences extends { [Key in keyof Influences]: PropertyKey },
    Tokens extends object,
> = {
    [
        Key in keyof Influences as Key extends string ? `${Key}Resolver` : never
    ]?: {
        [Value in Influences[Key]]?: TokenValue<Tokens, Omit<Influences, Key>>;
    };
};

/** Optional state overrides keyed by any supported influence value. */
export type StateInfluenceResolvers<
    Influences extends { [Key in keyof Influences]: PropertyKey },
    Tokens extends object,
> = {
    [Value in Influences[keyof Influences]]?: TokenValue<Tokens, Influences>;
};

/** A state accepts direct tokens, a callback, or influence-value overrides. */
export type StateTokenValue<
    Influences extends { [Key in keyof Influences]: PropertyKey },
    Tokens extends object,
> =
    | TokenValue<Tokens, Influences>
    | StateInfluenceResolvers<Influences, Tokens>;

/** Overrides applied when the corresponding component state is active. */
export type StateTokenResolvers<
    Influences extends { [Key in keyof Influences]: PropertyKey },
    Tokens extends object,
    States extends string,
> = {
    [State in States]?: StateTokenValue<Influences, Tokens>;
};

/** Maps fully resolved tokens to each slot's specific native style type. */
export type SlotStyleResolvers<
    Tokens extends object,
    SlotStyles extends {
        [Slot in keyof SlotStyles]: TextStyle | ViewStyle;
    },
> = {
    [Slot in keyof SlotStyles]: (tokens: Tokens) => SlotStyles[Slot];
};

/**
 * Influences are named, resolved component props (after defaults are applied).
 * Influence values must be valid object keys (string, number, or symbol).
 * Each influence resolver maps its supported values to token overrides.
 * Influence callbacks receive the other influences; their own value is the key.
 * State callbacks receive the entire influences object.
 * SlotStyles maps slot names to their native style types, for example
 * `{ container: ViewStyle; text: TextStyle }`.
 * Default tokens provide a complete starting point before partial overrides.
 */
export type StyleDefinition<
    Influences extends { [Key in keyof Influences]: PropertyKey },
    Tokens extends object,
    States extends string,
    SlotStyles extends {
        [Slot in keyof SlotStyles]: TextStyle | ViewStyle;
    },
> = {
    readonly [styleDefinitionContract]?: {
        influences: Influences;
        tokens: Tokens;
        states: States;
        slots: SlotStyles;
    };
    defaultTokens: Tokens;
    /** Defaults to influenceResolvers declaration order. Each influence runs once. */
    influenceOrder?: readonly (keyof Influences & string)[];
    /** Defaults to stateResolvers declaration order; later active states win. */
    stateOrder?: readonly States[];
    influenceResolvers: TokenResolvers<Influences, Tokens>;
    stateResolvers: StateTokenResolvers<Influences, Tokens, States>;
    slotStyles: SlotStyleResolvers<Tokens, SlotStyles>;
    /** Reanimated CSS transition settings to spread into an animated slot's style. */
    transition?: CSSTransitionProperties;
};

/** Extract the contract from a definition annotated with StyleDefinition. */
export type DefinitionContract<Definition> = Definition extends {
    readonly [styleDefinitionContract]?: infer Contract;
}
    ? NonNullable<Contract>
    : never;

export type ResolveComponentOptions<Definition> =
    DefinitionContract<Definition> extends {
        influences: infer Influences;
        states: infer States extends string;
        slots: infer Slots;
    }
        ? {
              influencers: Influences;
              states?: Partial<Record<States, boolean>>;
              /** Applied last per slot, preserving style arrays. */
              overrides?: StyleOverrides<keyof Slots & string>;
          }
        : never;

/** Native slot styles and optional overrides, composed as style arrays. */
export type ResolvedComponentStyles<Definition> =
    DefinitionContract<Definition> extends { slots: infer Slots }
        ? { [Slot in keyof Slots]: StyleProp<Slots[Slot]> }
        : never;

/** Structural constraint only; public hook types use each definition's contract. */
export interface StyleDefinitionShape {
    defaultTokens: object;
    influenceResolvers: object;
    stateResolvers: object;
    slotStyles: Record<string, (tokens: never) => TextStyle | ViewStyle>;
    influenceOrder?: readonly string[];
    stateOrder?: readonly string[];
    transition?: CSSTransitionProperties;
}
