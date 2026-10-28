import type { StyleOverrides } from '../../utils/types';
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
        Record<PropertyKey, TokenEntry> | undefined
    >;
    stateResolvers: Record<string, TokenEntry | undefined>;
    slotStyles: Record<string, (tokens: Tokens) => object>;
    influenceOrder?: readonly string[];
    stateOrder?: readonly string[];
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
        influencers,
        states = {},
        overrides = {},
    } = options as {
        influencers: Influences;
        states?: Record<string, boolean>;
        overrides?: StyleOverrides<string>;
    };
    const tokens = { ...config.defaultTokens };
    const declaredInfluences = Object.keys(config.influenceResolvers).map(
        (key) => key.slice(0, -'Resolver'.length)
    );
    const influenceOrder = [
        ...new Set([...(config.influenceOrder ?? []), ...declaredInfluences]),
    ];

    for (const key of influenceOrder) {
        const group = config.influenceResolvers[`${key}Resolver`];
        const value = influencers[key];
        if (!group || value === undefined || !hasOwn(group, value)) {
            continue;
        }
        const entry = group[value];
        if (entry === undefined) {
            continue;
        }
        // Match the type-level Omit: a resolver cannot inspect its own influence.
        const otherInfluences = { ...influencers };
        delete otherInfluences[key];
        Object.assign(tokens, evaluate(entry, otherInfluences));
    }

    const stateOrder = [
        ...new Set([
            ...(config.stateOrder ?? []),
            ...Object.keys(config.stateResolvers),
        ]),
    ];

    for (const state of stateOrder) {
        const entry = config.stateResolvers[state];
        if (!states[state] || entry === undefined) {
            continue;
        }
        if (typeof entry === 'function') {
            Object.assign(tokens, entry(influencers));
            continue;
        }

        const keys = Reflect.ownKeys(entry);
        const influenceValues = new Set(Object.values(influencers).map(String));
        const isTokenObject = keys.every((key) =>
            hasOwn(config.defaultTokens, key)
        );
        const isInfluenceMap = keys.every((key) =>
            typeof key === 'symbol'
                ? Object.values(influencers).includes(key)
                : influenceValues.has(key) || !hasOwn(config.defaultTokens, key)
        );

        if (keys.length > 0 && isTokenObject && isInfluenceMap) {
            throw new Error(
                `Ambiguous state "${state}": token names overlap influence values. Use a state callback instead.`
            );
        }
        if (isTokenObject) {
            Object.assign(tokens, entry);
            continue;
        }
        if (!isInfluenceMap) {
            throw new Error(
                `State "${state}" mixes token keys and influence values.`
            );
        }

        // Also consider influences that have no base resolver configured.
        const stateInfluences = [
            ...new Set([...influenceOrder, ...Object.keys(influencers)]),
        ];
        const matchedValues = new Set<PropertyKey>();
        for (const key of stateInfluences) {
            const value = influencers[key];
            if (
                value === undefined ||
                matchedValues.has(value) ||
                !hasOwn(entry, value)
            ) {
                continue;
            }
            matchedValues.add(value);
            const override = entry[value as keyof typeof entry] as
                TokenEntry | undefined;
            if (override !== undefined) {
                Object.assign(tokens, evaluate(override, influencers));
            }
        }
    }

    const slots: Record<string, object> = {};
    for (const [slot, getStyle] of Object.entries(config.slotStyles)) {
        const baseStyle = { ...getStyle(tokens), ...config.transition };
        const override = overrides[slot];
        // Do not flatten or spread animated styles: retain their identity and metadata.
        slots[slot] =
            override === undefined ? baseStyle : [baseStyle, override];
    }
    return { styles: slots, tokens } as ResolvedComponentResult<Definition>;
}
