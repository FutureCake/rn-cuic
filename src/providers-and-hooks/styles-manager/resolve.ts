import type {
    ResolveComponentOptions,
    ResolvedComponentResult,
    StyleDefinitionShape,
} from './types';

type Tokens = Record<string, unknown>;
type Influences = Record<string, PropertyKey>;
type TokenEntry = Tokens | ((influences: Influences) => Tokens);

interface RuntimeDefinition {
    defaultTokens: Tokens;
    influenceResolvers: Record<
        string,
        Record<PropertyKey, TokenEntry | undefined> | undefined
    >;
    stateResolvers: Record<string, TokenEntry | undefined>;
    slotStyles: Record<string, (tokens: Tokens) => object>;
    transition?: object;
}

const hasOwn = (object: object, key: PropertyKey) =>
    Object.prototype.hasOwnProperty.call(object, key);

function evaluate(entry: TokenEntry, influences: Influences): Tokens {
    return typeof entry === 'function' ? entry(influences) : entry;
}

/** Pure resolver, shared by the hook and tests. Later token overrides win. */
export function resolveComponentStyles<Definition extends StyleDefinitionShape>(
    definition: Definition,
    options: ResolveComponentOptions<NoInfer<Definition>>
): ResolvedComponentResult<Definition> {
    // Erasure is isolated here; public inputs/outputs retain their component contract.
    const config = definition as unknown as RuntimeDefinition;
    const {
        influences,
        states = {},
        overrides = {},
    } = options as {
        influences: Influences;
        states?: Record<string, boolean>;
        overrides?: Record<string, unknown>;
    };
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
        Object.assign(tokens, evaluate(entry, otherInfluences));
    }

    // Declaration order; later active states win.
    for (const [state, entry] of Object.entries(config.stateResolvers)) {
        if (!states[state] || entry === undefined) {
            continue;
        }
        Object.assign(tokens, evaluate(entry, influences));
    }

    const slots: Record<string, object> = {};
    for (const [slot, getStyle] of Object.entries(config.slotStyles)) {
        const baseStyle = { ...getStyle(tokens), ...config.transition };
        const override = overrides[slot];
        // Do not flatten or spread animated styles: retain their identity and metadata.
        slots[slot] =
            override === undefined
                ? baseStyle
                : [baseStyle, override as object];
    }
    return { styles: slots, tokens } as ResolvedComponentResult<Definition>;
}
