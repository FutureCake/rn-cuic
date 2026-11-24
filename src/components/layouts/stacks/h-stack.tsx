import type { StackProps } from './shared';
import { Stack } from './shared';

export type HStackProps = Omit<StackProps, 'direction'>;

/** Lays out children left to right. */
export function HStack(props: HStackProps) {
    return <Stack {...props} direction="row" />;
}
