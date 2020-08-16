import { createSVGWindow } from 'svgdom';
import * as svg from '@svgdotjs/svg.js';

export const canvas = (): svg.Svg => {
    const window = createSVGWindow();
    const { document } = window;
    (svg as any).registerWindow(window, document);
    return svg.SVG(document.documentElement) as svg.Svg;
};
