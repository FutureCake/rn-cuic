import type { StackProps } from './shared';
import { Stack } from './shared';

export type VStackProps = Omit<StackProps, 'direction'>;

/** Lays out children top to bottom. */
export function VStack(props: VStackProps) {
    return <Stack {...props} direction="column" />;
}
