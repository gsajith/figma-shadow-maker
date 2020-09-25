figma.showUI(__html__, {height: 505, width: 256});
import getBezierValue from '../app/util/bezier';

let createdSelection = null;
let originalEffects = {};
let shouldCleanup = true;

figma.ui.onmessage = msg => {
    if (msg.type === 'apply') {
        shouldCleanup = false;
        figma.closePlugin();
    }
    if (msg.type === 'cancel') {
        figma.closePlugin();
    }
    if (msg.type === 'advanced') {
        if (msg.show) {
            figma.ui.resize(256, 832);
        } else {
            figma.ui.resize(256, 505);
        }
    }
    if (msg.type === 'rendered') {
        if (createdSelection == null && figma.currentPage.selection.length === 0) {
            // Render an empty object to put the shadow on
            const nodes = [];
            const rect = figma.createRectangle();
            rect.x = figma.viewport.center.x;
            rect.y = figma.viewport.center.y;
            rect.resize(200, 200);
            rect.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}];
            figma.currentPage.appendChild(rect);
            nodes.push(rect);
            figma.currentPage.selection = nodes;
            createdSelection = rect;
            figma.viewport.zoom = 1;
            figma.viewport.scrollAndZoomIntoView(nodes);
        }
        let selection = figma.currentPage.selection.length === 0 ? createdSelection : figma.currentPage.selection[0];
        if (!originalEffects[selection.id]) {
            originalEffects[selection.id] = selection.effects;
        }
        selection.effects = generateShadows(msg.shadowProps);
    }
};

figma.on('close', () => {
    if (shouldCleanup) {
        // Restore old effects on edited things
        if (createdSelection && figma.getNodeById(createdSelection.id)) {
            createdSelection.remove();
        }

        for (const nodeId in originalEffects) {
            let node = figma.getNodeById(nodeId);
            if (node) {
                node.effects = originalEffects[nodeId];
            }
        }
    }
});

const normalizeSmallNums = num => {
    if (Math.abs(num) < 0.0001) {
        return 0;
    }

    return num;
};

function generateShadows(props) {
    let shadows = [];
    for (var i = 0; i < props.layers; i++) {
        let rgb = hexToRGB(props.color);
        let offsetMagnitude = props.offset * getBezierValue(props.offsetBezier, (1 / props.layers) * (i + 1))[1];
        let offsetX = normalizeSmallNums(Math.cos((props.direction * Math.PI) / 180) * (props.gap + offsetMagnitude));
        let offsetY = normalizeSmallNums(
            Math.sin((props.direction * Math.PI) / 180) * (props.gap + offsetMagnitude) * -1
        );

        let alpha = props.alpha * getBezierValue(props.alphaBezier, (1 / props.layers) * (i + 1))[1];

        if (props.invertAlpha) {
            alpha = props.alpha * getBezierValue(props.alphaBezier, (1 / props.layers) * (props.layers - i))[1];
        }

        alpha = Math.min(Math.max(alpha, 0), 1);

        alpha = normalizeSmallNums(alpha);

        let radius = normalizeSmallNums(
            props.blur * Math.max(Math.min(getBezierValue(props.blurBezier, (1 / props.layers) * (i + 1))[1], 1.2), 0)
        );

        shadows.push({
            type: 'DROP_SHADOW',
            blendMode: 'NORMAL',
            visible: true,
            color: {r: rgb.r, b: rgb.b, g: rgb.g, a: alpha},
            offset: {x: offsetX, y: offsetY},
            radius: radius,
        } as ShadowEffect);
    }
    return shadows;
}

function hexToRGB(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16) / 255,
              g: parseInt(result[2], 16) / 255,
              b: parseInt(result[3], 16) / 255,
          }
        : null;
}
