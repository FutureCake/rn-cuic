import { systemStyleKit, type StyleKit } from './fonts';
import type {
    ResolveComponentOptions,
    ResolvedComponentResult,
    StyleDefinitionShape,
} from './types';

type Tokens = Record<string, unknown>;
type Influences = Record<string, PropertyKey | undefined>;
type Flags = Readonly<Record<string, boolean>>;
type TokenEntry =
    Tokens | ((influences: Influences, structure: Flags) => Tokens);

interface RuntimeDefinition {
    defaultTokens: Tokens;
    influenceResolvers: Record<
        string,
        Record<PropertyKey, TokenEntry | undefined> | undefined
    >;
    stateResolvers: Record<string, TokenEntry | undefined>;
    structureResolvers?: Record<string, TokenEntry | undefined>;
    slotStyles: Record<string, (tokens: Tokens, kit: StyleKit) => object>;
    transition?: object;
}

const hasOwn = (object: object, key: PropertyKey) =>
    Object.prototype.hasOwnProperty.call(object, key);

function evaluate(
    entry: TokenEntry,
    influences: Influences,
    structure: Flags
): Tokens {
    return typeof entry === 'function' ? entry(influences, structure) : entry;
}

/**
 * Pure resolver, shared by the hook and tests. Later token overrides win.
 * The kit resolves font roles; it defaults to system fonts.
 */
export function resolveComponentStyles<Definition extends StyleDefinitionShape>(
    definition: Definition,
    options: ResolveComponentOptions<Definition>,
    kit: StyleKit = systemStyleKit
): ResolvedComponentResult<Definition> {
    // Erasure is isolated here; public inputs/outputs retain their component contract.
    const config = definition as unknown as RuntimeDefinition;
    const {
        influences,
        states = {},
        structure: structureOption = {},
        overrides = {},
    } = options as {
        influences: Influences;
        states?: Record<string, boolean>;
        structure?: Flags;
        overrides?: Record<string, unknown>;
    };
    // Copied so callbacks cannot mutate the caller's flags.
    const structure: Flags = { ...structureOption };
    const tokens = { ...config.defaultTokens };

    // Declaration order; each influence applies at most once.
    for (const [influence, group] of Object.entries(
        config.influenceResolvers
    )) {
        const value = influences[influence];
        if (group === undefined || value === undefined) {
            continue;
        }
        if (!hasOwn(group, value)) {
            if (__DEV__) {
                console.warn(
                    `No "${influence}" style entry for value "${String(value)}"; defaults apply.`
                );
            }
            continue;
        }
        const entry = group[value];
        if (entry === undefined) {
            continue;
        }
        // Match the type-level Omit: a resolver cannot inspect its own influence.
        const otherInfluences = { ...influences };
        delete otherInfluences[influence];
        Object.assign(tokens, evaluate(entry, otherInfluences, structure));
    }

    // Declaration order; later active structures win.
    for (const [flag, entry] of Object.entries(
        config.structureResolvers ?? {}
    )) {
        if (!structure[flag] || entry === undefined) {
            continue;
        }
        Object.assign(tokens, evaluate(entry, influences, structure));
    }

    // Declaration order; later active states win.
    for (const [state, entry] of Object.entries(config.stateResolvers)) {
        if (!states[state] || entry === undefined) {
            continue;
        }
        Object.assign(tokens, evaluate(entry, influences, structure));
    }

    const slots: Record<string, object> = {};
    for (const [slot, getStyle] of Object.entries(config.slotStyles)) {
        const baseStyle = { ...getStyle(tokens, kit), ...config.transition };
        const override = overrides[slot];
        // Do not flatten or spread animated styles: retain their identity and metadata.
        slots[slot] =
            override === undefined
                ? baseStyle
                : [baseStyle, override as object];
    }
    return { styles: slots, tokens } as ResolvedComponentResult<Definition>;
}
