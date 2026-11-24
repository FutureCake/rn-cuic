---
name: component-authoring
description: 'Add or modify a rn-cuic UI component (Button, Toggle, TextField, or a new input/container/visual). Use when creating a new component, porting/recreating a component from external reference files or another codebase, adding slots/props/tokens/influences/states to an existing one, or restructuring component files. Enforces the strict per-component folder structure and requires interviewing the user until the component contract (influences, tokens, states, slots, shorthand props, behavior) has zero ambiguity.'
argument-hint: 'Which component to add or change, and what it should do'
---

# rn-cuic Component Authoring

rn-cuic is a themeable RN component library. Every component follows the same
style-resolution architecture and the same strict folder layout. Never invent a
new structure; copy the patterns of the existing components
([button](../../../src/components/inputs/button/),
[toggle](../../../src/components/inputs/toggle/),
[text-field](../../../src/components/inputs/text-inputs/text-field/), and for
containers [bottom-sheet](../../../src/components/containers/bottom-sheet/)).

## Core concepts (in dependency order)

1. **Tokens** — the flat value vocabulary of a component (colors, sizes,
   paddings, offsets). Everything else resolves *into* tokens; slot styles are
   built *from* tokens. Declared as a `<Component>Tokens` type.
2. **Influences** — prop-driven style inputs (e.g. `variant`, `size`, `theme`,
   `feedbackVariant`). Each is a string-union generic with a library default
   (`Variant extends string = ButtonVariant`). `theme` is always an influence;
   components read it `themeProp ?? useTheme().theme` (ambient from
   `StylesProvider`).
3. **States** — boolean runtime conditions (`pressed`, `focused`, `disabled`,
   `active`). **Declaration order is precedence**: later state declarations win
   on token conflicts (`disabled` is declared last so it wins).
4. **Slot styles** — the styled parts of a component mapped to their RN style
   type: `{ container: ViewStyle; text: TextStyle; icon: ImageStyle }`. These
   name every visual part, even for single-element components (Toggle:
   `container`/`indicator`).
5. **Style definition** — `StyleDefinition<Influences, Tokens, States,
   SlotStyles>` tying 1–4 together. Authored only through the component's
   `define<Component>Styles` helper, which infers influence value names from
   the resolver map.
6. **Compound slots** — optional child components (`Button.Text`,
   `TextField.Header`) for composition. Only components with user-composable
   parts have them. Slots are plain shared components resolving the nearest
   root's context; context is **shared across `createUI` families by design**
   (do not propose per-family context isolation).
7. **Shorthand props** — root props (`text`, `icon`, `header`, `feedback`)
   that render a default slot only when `!hasSlot(children, SlotComponent)`.
   Children render in place; missing required slots are appended. **No child
   reordering.**
8. **Render-function children** — slots that expose resolved values accept
   `children` as `ReactNode | ((renderProps) => ReactNode)` with a
   `<Slot>RenderProps` type (always includes `tokens` and the merged `style`).

## Strict folder structure

```
src/components/<category>/<component>/   # category: inputs | overlays | visuals | layouts
├── types.ts              # Tokens, influences, states, slot styles,
│                         #   StyleDefinition alias, BuilderOptions, root Props,
│                         #   behavior types (e.g. Validation). NO slot prop types.
├── define-styles.ts      # define<Component>Styles — THE authoring path
├── styles.ts             # <component>StyleDefinition preset, dogfoods define-styles
├── create-<component>.tsx# create<Component>({ defaults?, useStyles, useTheme })
│                         #   → root component; Object.assign(Root, { Slot… })
├── factory.ts            # <component>Factory → UIComponentDescriptor for the
│                         #   subpath/core createUI (preset + custom overloads)
├── index.tsx             # re-exports define-styles, factory, styles, types
│                         #   (no component)
├── context.ts            # ONLY if compound slots: module-level
│                         #   createSlotContext<ContextValue>('<Component>')
│                         #   exporting { ContextProvider, useSlotContext }
├── constants.ts          # ONLY if fixed behavioral constants exist (gesture
│                         #   thresholds, durations, spring configs). These are
│                         #   deliberately NOT tokens — not themeable.
├── hooks/                # ONLY if the root outgrows comfortable reading:
│   └── use-<name>.ts     #   cohesive dedicated hooks (bottom-sheet:
│                         #   use-bottom-sheet-slots = slot extraction + its
│                         #   dev warnings; use-bottom-sheet-animation = the
│                         #   whole gesture/animation engine). Extract only
│                         #   when it clarifies — never split units that would
│                         #   need heavy value-wiring between hooks, and never
│                         #   create hooks for their own sake. The root keeps
│                         #   styles resolution, flags/dev warnings and render.
└── slots/                # ONLY if compound slots
    └── <slot>.tsx        # Plain component + its Props/RenderProps types
                          #   co-located in the same file
```

Rules:
- Slot prop types live **with the slot file**, never in types.ts.
- Components without compound slots (Toggle) have **no** context.ts or slots/
  — do not add them speculatively.
- Closely related components may be grouped in a family folder with a shared
  module (`src/components/inputs/text-inputs/{shared/, text-field/,
  text-area/}`). Each
  component keeps the full per-component layout above and its own exported
  slot components (slot identity drives `hasSlot`), plus its own `styles.ts`
  preset — only behavior (`shared/use-field-behavior.ts`), contract types
  (`shared/types.ts`: `Feedback`, `Validation`, `FieldStates`,
  `FieldInfluences`, `InfluenceValueMap`) and slot bodies
  (`shared/*-slot.tsx`) are shared. Subpath exports stay per component
  (`rn-cuic/text-field`, `rn-cuic/text-area`).
- Simplify whenever possible (user principle: "if we can simplify we should
  always simplify"). No factory wrappers around slot components; no unused
  abstraction layers.
- **Layout primitives (`layouts/`, e.g. VStack) skip the factory architecture
  entirely**: no tokens/influences/states/factory/createUI registration — a
  single `<component>.tsx` (plain component + its prop types) plus an
  `index.ts` barrel, exported directly from the root barrel and its own
  subpath. Structural facts (spacing, padding, align/justify) are plain
  props, not variants. Static primitives render plain RN elements (no
  Reanimated) and still get a story + example-app demo, but are NOT added to
  `stories/helpers/ui.ts` or any `createUI` call.

## Implementation requirements

- **Reuse `src/shared/` before writing logic.** Check
  [src/shared/](../../../src/shared/) for existing hooks
  (`shared/hooks/`), plain functions (`shared/utils/`), context helpers
  (`shared/contexts/`), animated wrappers (`shared/libs/`) and contract types
  (`shared/types.ts`) before implementing behavior in a component — never
  rewrite the same logic slightly differently. If a component needs a local
  variation, compose a local hook/function that delegates the heavy lifting
  to the shared one (cf. `useFieldBehavior` layering focus/blur gating on top
  of `useValidationFeedback`; Chip gating `usePressedState` handlers behind
  `interactive`). Current inventory: `usePressedState` (pressed tracking with
  disabled suppression), `useValidationFeedback` (validation state + feedback
  normalization + variant/message precedence), `extractSingletonSlots`
  (first-wins singleton slot extraction with dev warnings), `hasSlot`,
  `createSlotContext`, and the `Feedback`/`FeedbackVariant`/
  `ValidationResult`/`ThemeMode`/`StyleOverrides` types. When two components
  end up duplicating logic, extract it here (hooks → `shared/hooks/`,
  functions → `shared/utils/`, types → `shared/types.ts`) — but only when it
  stays readable (user preference: no consolidation that hurts readability).
  `src/shared/` is internal except what its index re-exports via core.
- Themed/animated components render Reanimated components (`Animated.View`,
  `Animated.Text`, shared wrappers from
  [src/shared/libs/reanimated.ts](../../../src/shared/libs/reanimated.ts)
  such as `AnimatedPressable`/`AnimatedTextInput` — add new
  `Animated.createAnimatedComponent(...)` instances there) — required
  wherever resolved slot styles carry CSS `transition`s or animated values.
  Components with NO animation (static layout primitives like VStack) use
  plain RN elements; only use Animated components when the element actually
  animates. `ThemeMode` lives in `src/shared/types.ts`.
- Root owns behavior and native props; slots only position/style (TextField
  passes native input props to its Input slot via context).
- Positioned/overlay components (containers): structural positioning styles
  (absolute fill, anchoring, overflow clipping) live in the create file via
  `StyleSheet.create`, NOT in slotStyles — so style overrides can restyle but
  never break positioning (slot styles are merged after structural, so
  intentional lifting/insetting via overrides still wins).
- Props: omit conflicting native props (`style`, `children`, plus
  behavior-owned ones like `editable`); `styleOverrides:
  StyleOverrides<SlotStyles>` on every root; a root `style` prop (if offered)
  merges into the container override.
- Accessibility: set `accessibilityRole` (overridable) and merge
  `accessibilityState` with `disabled`/`checked` etc.
- `disabled` always neutralizes interactive states (`pressed && !disabled`).
- Sparse low-level definitions need an explicit `StyleDefinition` annotation
  (`satisfies` alone is insufficient — unique-symbol contract metadata).

## Registration checklist (every new component)

1. `src/components/<category>/<component>/factory.ts` — `<component>Factory`
   returning a
   `UIComponentDescriptor` (import type from `../../../core`). Preset overload
   (`definition?: undefined`, optional preset-typed `defaults`) + custom
   overload (`definition` required, `defaults: NoInfer<…>` required); loose
   implementation signature returns `UIComponentDescriptor<StyleDefinitionShape,
   ThemeMode, unknown>`, applies preset fallbacks (factories are the single
   source of preset defaults), and builds via `create<Component>` with
   `useStyles(options as never)`. Components are built only when their factory
   is passed to `createUI` — adding one is not a breaking change.
2. `src/components/<category>/<component>/index.tsx` — the component barrel:
   export
   `define<Component>Styles`, `<component>Factory`, `export * from './styles'`
   and `'./types'`, and `export type *` from every slot file.
3. [src/index.tsx](../../../src/index.tsx) — add a single
   `export * from './components/<category>/<component>';` line. The root barrel
   also
   `export * from './core'`; new component export names must not clash with
   core's (clashing `export *` names are silently dropped).
4. [package.json](../../../package.json) `exports` +
   [tsconfig.json](../../../tsconfig.json) `paths` — add the
   `rn-cuic/<component>` subpath entry (`rn-cuic-source` → src barrel, `types`
   → `lib/typescript/src/…/index.d.ts`, `default` → `lib/module/…/index.js`).
5. `src/components/<category>/index.ts` if the category has a barrel
   (currently only `visuals/`).
6. [stories/helpers/ui.ts](../../../stories/helpers/ui.ts) — add
   `<component>Factory()` to the shared story family and its destructured
   export.
7. Story in `stories/<category>/<component>.stories.tsx` (stories are part of
   the build typecheck). Import the component from `../helpers/ui`, use the
   `withRenderContainer` decorator; demo shorthand props, compound slots, and
   render-function children.
8. [example/src/App.tsx](../../../example/src/App.tsx) — add the component to
   the example app: `<component>Factory()` (preset, via its `rn-cuic/<component>`
   subpath import) in the module-scope `createUI` call and a minimal demo in
   `Showcase`. If the component needs runtime infrastructure (providers such
   as `KeyboardProvider`, root views), wire it in `App` — the example is also
   the smoke test for consumer setup requirements.

## New component: interview first — zero ambiguity

Before writing any code for a **new** component, ask the user questions (use
the ask-questions tool) until every row of the contract below is pinned down.
Do not guess or fill gaps with "sensible defaults" silently — propose options
and get confirmation.

| Contract item | Must be answered |
|---|---|
| Name & category | inputs / containers / visuals? |
| Influences | Which besides `theme`? Value names? Library defaults? Which are factory `defaults`? |
| Tokens | Full token list with RN style types; which are per-theme vs fixed? |
| States | Which booleans? Precedence order on conflicts? |
| Slot styles | Every visual part and its style type (ViewStyle/TextStyle/ImageStyle) |
| Compound slots | Composable parts? For each: underlying element, props, render-function support and its RenderProps |
| Shorthand props | Which slots get a root-prop shorthand, and its type (string vs object — attributes of a message travel *with* it, cf. `feedback: string \| Feedback`) |
| Behavior | Controlled vs internal state? Callbacks? Validation-like systems? Which native component does the root wrap, and which native props are root-owned? |
| Accessibility | Role, state mapping |
| Animation | Which token changes animate (tokens + style transitions, not useSharedValue) |

For **modifications**, ask only about the deltas — but if a change touches the
public API (props, slots, exported types), confirm the exact shape before
editing, and check whether prop design follows existing conventions (e.g.
variant belongs to the feedback value, not a sibling prop).

## Building from external reference files

When the user supplies reference files that are **not** part of this project
(a component from another codebase, a web/CSS implementation, a design-system
snippet, a screenshot/spec):

1. **Read every reference fully first.** Then restate, in rn-cuic vocabulary,
   what you extracted: proposed influences, tokens, states, slots, shorthand
   props, behavior. The reference is a statement of *intent*, not an
   implementation to copy.
2. **Never port the reference's architecture.** Its styling system (CSS,
   styled-components, other theme engines), state management, animation
   library, file layout, and naming conventions are all replaced by this
   library's: `StyleDefinition` + `define<Component>Styles`, tokens + style
   transitions, Reanimated components, and the strict folder structure above.
3. **Run the full interview**, pre-filled with what the reference answered.
   Additionally ask the translation questions the reference cannot answer:
   - Which reference features are in scope vs out of scope here?
   - Reference values that conflict with library conventions (prop names,
     variant names, defaults): keep the reference's or follow rn-cuic's?
   - Hardcoded values in the reference: which become tokens, and which (if
     any) stay fixed? Which tokens vary per theme/influence?
   - Behavior that depends on the source platform (DOM events, CSS
     pseudo-classes, media queries): what is the intended RN equivalent?
   - Anything the reference leaves implicit (a11y, disabled handling, theming)
     — the reference omitting it does not mean the user wants it omitted.
4. **Confirm the mapped contract table** with the user before writing code —
   same zero-ambiguity bar as a from-scratch component. Flag any part of the
   reference you intentionally dropped or changed so nothing disappears
   silently.

## Validation (always, in this order)

```sh
yarn tsc --project tsconfig.build.json --noEmit
yarn eslint --fix src/components/<category>/<component> stories/<category>/<component>.stories.tsx
yarn tsc --project example/tsconfig.json --noEmit
```

- Prettier tabWidth=4; let `eslint --fix` settle formatting.
- Do **not** run or update `__tests__`/type-tests without asking — they are
  intentionally stale during the exploratory phase.
