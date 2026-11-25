import type { TextStyle } from 'react-native';
import type { FontRole, Fonts, FontSpec, FontWeight } from '../../shared/types';

/** The font part of a text style, ready to spread into a slot style. */
export type FontStyle = Pick<TextStyle, 'fontFamily' | 'fontWeight'>;

/** Instance-bound helpers handed to every slot style resolver. */
export type StyleKit = {
    /**
     * Resolves a font role and weight to platform-safe font props. Unset
     * roles fall back to `body`, then to the system font.
     */
    font: (role: FontRole, weight?: FontWeight) => FontStyle;
};

const BUILT_IN_ROLES: ReadonlySet<string> = new Set(['body', 'heading']);

/** Nearest available weight; ties go to the heavier face. */
function nearestFace(
    faces: Partial<Record<FontWeight, string>>,
    weight: FontWeight
): string | undefined {
    let best: { face: string; distance: number; weight: number } | undefined;
    for (const [key, face] of Object.entries(faces)) {
        if (face === undefined) {
            continue;
        }
        const faceWeight = Number(key);
        const distance = Math.abs(faceWeight - weight);
        if (
            best === undefined ||
            distance < best.distance ||
            (distance === best.distance && faceWeight > best.weight)
        ) {
            best = { face, distance, weight: faceWeight };
        }
    }
    return best?.face;
}

function toFontStyle(
    spec: FontSpec | undefined,
    weight: FontWeight
): FontStyle {
    if (spec === undefined) {
        return { fontWeight: weight };
    }
    if (typeof spec === 'string') {
        return { fontFamily: spec, fontWeight: weight };
    }
    const face = nearestFace(spec, weight);
    // A specific face already encodes its weight; 'normal' keeps platforms
    // from synthesizing or re-matching it.
    return face === undefined
        ? { fontWeight: weight }
        : { fontFamily: face, fontWeight: 'normal' };
}

/** Builds the slot-style kit for one createUI instance's fonts. */
export function createStyleKit(fonts: Fonts = {}): StyleKit {
    const warned = new Set<string>();
    return {
        font(role, weight = 400) {
            let spec = fonts[role];
            if (spec === undefined && role !== 'body') {
                if (__DEV__ && !BUILT_IN_ROLES.has(role) && !warned.has(role)) {
                    warned.add(role);
                    console.warn(
                        `Font role "${role}" is not in createUI fonts; using "body".`
                    );
                }
                spec = fonts.body;
            }
            return toFontStyle(spec, weight);
        },
    };
}

/** System fonts only: the kit used when no fonts are configured. */
export const systemStyleKit: StyleKit = createStyleKit();
