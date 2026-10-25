import { buttonStyleDefinition } from './inputs/button/styles';
import { createStylesManager } from './providers-and-hooks/styles-manager';

/** Add further annotated component definitions here to extend the typed hook. */
export const componentStyles = { Button: buttonStyleDefinition };

export const { StylesProvider, useResolveComponentStyles } =
    createStylesManager(componentStyles);
