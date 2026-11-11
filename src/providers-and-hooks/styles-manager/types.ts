import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { CSSTransitionProperties } from 'react-native-reanimated';
import type { StyleOverrides } from '../../utils/types';

/** Type-only metadata preserves each definition's contract through a collection. */
declare const styleDefinitionContract: unique symbol;

/** Static token overrides or a callback with the supplied influence context. */
export type TokenValue<Tokens extends object, Influences extends object> =
    Partial<Tokens> | ((influences: Influences) => Partial<Tokens>);

/** Per-influence value maps whose callbacks exclude their own influence. */
export type TokenResolvers<
    Influences extends { [Key in keyof Influences]: PropertyKey },
    Tokens extends object,
> = {
    [Key in keyof Influences]?: {
        [Value in Influences[Key]]?: TokenValue<Tokens, Omit<Influences, Key>>;
    };
};

/** Overrides applied when the corresponding component state is active. */
export type StateTokenResolvers<
    Influences extends { [Key in keyof Influences]: PropertyKey },
    Tokens extends object,
    States extends string,
> = {
    [State in States]?: TokenValue<Tokens, Influences>;
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
 * Influences and states apply in declaration order; later entries win.
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
    influenceResolvers: TokenResolvers<Influences, Tokens>;
    stateResolvers: StateTokenResolvers<Influences, Tokens, States>;
    slotStyles: SlotStyleResolvers<Tokens, SlotStyles>;
    /** Reanimated CSS transition settings to spread into each slot's style. */
    transition?: CSSTransitionProperties;
};

/** Extract the contract from a definition annotated with StyleDefinition. */
export type DefinitionContract<Definition> = Definition extends {
    readonly [styleDefinitionContract]?: infer Contract;
}
    ? NonNullable<Contract>
    : never;

/** Partial, section-wise overrides for one component's default definition. */
export type StyleDefinitionOverride<Definition> =
    DefinitionContract<Definition> extends {
        influences: infer Influences extends Record<string, PropertyKey>;
        tokens: infer Tokens extends object;
        states: infer States extends string;
        slots: infer Slots;
    }
        ? {
              defaultTokens?: Partial<Tokens>;
              influenceResolvers?: {
                  [Key in keyof Influences]?: {
                      [Value in Influences[Key]]?: TokenValue<
                          Tokens,
                          Omit<Influences, Key>
                      >;
                  };
              };
              stateResolvers?: {
                  [State in States]?: TokenValue<Tokens, Influences>;
              };
              slotStyles?: {
                  [Slot in keyof Slots]?: (tokens: Tokens) => Slots[Slot];
              };
              transition?: CSSTransitionProperties;
          }
        : never;

export type ResolveComponentOptions<Definition> =
    DefinitionContract<Definition> extends {
        influences: infer Influences;
        states: infer States extends string;
        slots: infer Slots extends object;
    }
        ? {
              influences: Influences;
              states?: Partial<Record<States, boolean>>;
              /** Applied last per slot, preserving style arrays. */
              overrides?: StyleOverrides<Slots>;
          }
        : never;

/** Native slot styles and optional overrides, composed as style arrays. */
export type ResolvedComponentStyles<Definition> =
    DefinitionContract<Definition> extends { slots: infer Slots }
        ? { [Slot in keyof Slots]: StyleProp<Slots[Slot]> }
        : never;

/** Final tokens after influences and active states, before slot overrides. */
export type ResolvedComponentTokens<Definition> =
    DefinitionContract<Definition> extends { tokens: infer Tokens }
        ? Readonly<Tokens>
        : never;

export type ResolvedComponentResult<Definition> = {
    styles: ResolvedComponentStyles<Definition>;
    tokens: ResolvedComponentTokens<Definition>;
};

/** Structural constraint only; public hook types use each definition's contract. */
export interface StyleDefinitionShape {
    defaultTokens: object;
    influenceResolvers: object;
    stateResolvers: object;
    slotStyles: Record<string, (tokens: never) => TextStyle | ViewStyle>;
    transition?: CSSTransitionProperties;
}
