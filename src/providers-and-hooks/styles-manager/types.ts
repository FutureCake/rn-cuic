import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { CSSTransitionProperties } from 'react-native-reanimated';
import type { StyleOverrides } from '../../shared/types';
import type { StyleKit } from './fonts';

/**
 * Transition settings spread into every slot. Typed over all slot style kinds
 * so text-only properties (`color`, `fontSize`) can be listed too.
 */
export type SlotTransition = CSSTransitionProperties<
    ViewStyle & TextStyle & ImageStyle
>;

/** Type-only metadata preserves each definition's contract through a collection. */
declare const styleDefinitionContract: unique symbol;

/**
 * Every structure flag a component declares, true when that part is present
 * (for example `{ hasIcon: true, hasText: false }`). Empty for components
 * without structure flags.
 */
export type StructureFlags<Structures extends string> = Readonly<
    Record<Structures, boolean>
>;

/**
 * Static token overrides or a callback with the supplied influence context.
 * Callbacks also receive the component's structure flags as a second argument.
 */
export type TokenValue<
    Tokens extends object,
    Influences extends object,
    Structures extends string = never,
> =
    | Partial<Tokens>
    | ((
          influences: Influences,
          structure: StructureFlags<Structures>
      ) => Partial<Tokens>);

/**
 * Influence values must be object keys. An optional influence (`weight?: W`)
 * may be omitted at runtime; its resolver is then skipped.
 */
export type InfluenceShape<Influences> = {
    [Key in keyof Influences]: PropertyKey | undefined;
};

/** Per-influence value maps whose callbacks exclude their own influence. */
export type TokenResolvers<
    Influences extends InfluenceShape<Influences>,
    Tokens extends object,
    Structures extends string = never,
> = {
    [Key in keyof Influences]?: {
        [Value in Extract<Influences[Key], PropertyKey>]?: TokenValue<
            Tokens,
            Omit<Influences, Key>,
            Structures
        >;
    };
};

/** Overrides applied when the corresponding component state is active. */
export type StateTokenResolvers<
    Influences extends InfluenceShape<Influences>,
    Tokens extends object,
    States extends string,
    Structures extends string = never,
> = {
    [State in States]?: TokenValue<Tokens, Influences, Structures>;
};

/** Overrides applied when the corresponding structure flag is true. */
export type StructureTokenResolvers<
    Influences extends InfluenceShape<Influences>,
    Tokens extends object,
    Structures extends string,
> = {
    [Structure in Structures]?: TokenValue<Tokens, Influences, Structures>;
};

/**
 * Maps fully resolved tokens to each slot's specific native style type. The
 * kit resolves font roles against the createUI instance's fonts.
 */
export type SlotStyleResolvers<
    Tokens extends object,
    SlotStyles extends {
        [Slot in keyof SlotStyles]: TextStyle | ViewStyle;
    },
> = {
    [Slot in keyof SlotStyles]: (
        tokens: Tokens,
        kit: StyleKit
    ) => SlotStyles[Slot];
};

/**
 * Influences are named, resolved component props (after defaults are applied).
 * Influence values must be valid object keys (string, number, or symbol);
 * optional influences may be omitted, which skips their resolver.
 * Each influence resolver maps its supported values to token overrides.
 * Influence callbacks receive the other influences; their own value is the key.
 * State and structure callbacks receive the entire influences object.
 * Every callback also receives the structure flags as its second argument.
 * Order: default tokens, influences, active structures, active states; each
 * section applies in declaration order and later entries win.
 * Structures are boolean content flags (for example `hasIcon`, `hasText`)
 * the component derives from what it renders; they are optional per component.
 * SlotStyles maps slot names to their native style types, for example
 * `{ container: ViewStyle; text: TextStyle }`.
 * Default tokens provide a complete starting point before partial overrides.
 */
export type StyleDefinition<
    Influences extends InfluenceShape<Influences>,
    Tokens extends object,
    States extends string,
    SlotStyles extends {
        [Slot in keyof SlotStyles]: TextStyle | ViewStyle;
    },
    Structures extends string = never,
> = {
    readonly [styleDefinitionContract]?: {
        influences: Influences;
        tokens: Tokens;
        states: States;
        slots: SlotStyles;
        structures: Structures;
    };
    defaultTokens: Tokens;
    influenceResolvers: TokenResolvers<Influences, Tokens, Structures>;
    stateResolvers: StateTokenResolvers<Influences, Tokens, States, Structures>;
    structureResolvers?: StructureTokenResolvers<
        Influences,
        Tokens,
        Structures
    >;
    slotStyles: SlotStyleResolvers<Tokens, SlotStyles>;
    /** Reanimated CSS transition settings to spread into each slot's style. */
    transition?: SlotTransition;
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
        influences: infer Influences extends Record<
            string,
            PropertyKey | undefined
        >;
        tokens: infer Tokens extends object;
        states: infer States extends string;
        slots: infer Slots;
        structures: infer Structures extends string;
    }
        ? {
              defaultTokens?: Partial<Tokens>;
              influenceResolvers?: {
                  [Key in keyof Influences]?: {
                      [
                          Value in Extract<Influences[Key], PropertyKey>
                      ]?: TokenValue<Tokens, Omit<Influences, Key>, Structures>;
                  };
              };
              stateResolvers?: {
                  [State in States]?: TokenValue<
                      Tokens,
                      Influences,
                      Structures
                  >;
              };
              structureResolvers?: {
                  [Structure in Structures]?: TokenValue<
                      Tokens,
                      Influences,
                      Structures
                  >;
              };
              slotStyles?: {
                  [Slot in keyof Slots]?: (
                      tokens: Tokens,
                      kit: StyleKit
                  ) => Slots[Slot];
              };
              transition?: SlotTransition;
          }
        : never;

export type ResolveComponentOptions<Definition> =
    DefinitionContract<Definition> extends {
        influences: infer Influences;
        states: infer States extends string;
        slots: infer Slots extends object;
        structures: infer Structures extends string;
    }
        ? {
              influences: Influences;
              states?: Partial<Record<States, boolean>>;
              /** Applied last per slot, preserving style arrays. */
              overrides?: StyleOverrides<Slots>;
          } & ([Structures] extends [never]
              ? { structure?: never }
              : {
                    /** Every declared flag, so callbacks always see a boolean. */
                    structure: StructureFlags<Structures>;
                })
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
    structureResolvers?: object;
    slotStyles: Record<
        string,
        (tokens: never, kit: never) => TextStyle | ViewStyle
    >;
    transition?: SlotTransition;
}
