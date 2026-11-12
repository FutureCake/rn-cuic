import { View } from 'react-native';
import { StylesProvider } from './ui';

function RenderContainer({ children }: { children: React.ReactNode }) {
    return (
        <StylesProvider>
            <View
                style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 16 }}
            >
                {children}
            </View>
        </StylesProvider>
    );
}

import type { Decorator } from '@storybook/react-native';

export const withRenderContainer: Decorator = (Story) => (
    <RenderContainer>
        <Story />
    </RenderContainer>
);
