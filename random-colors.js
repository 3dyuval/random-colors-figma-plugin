let uiVisible = false;
figma.on('run', ({ command }) => {
    switch (command) {
        // run the plugin through hot key command "control + / + Random Colors / Apply"
        // or from the plugins menu
        case 'apply': {
            applyColors(figma.currentPage.selection);
            figma.closePlugin();
        }
        // same applies to this only this open the UI
        case 'ui': {
            figma.showUI(__uiFiles__.main);
            uiVisible = true;
        }
        default:
    }
});
figma.on('close', () => {
    uiVisible = false;
});
// event dispatched from UI
figma.ui.onmessage = msg => {
    if (msg.type === 'about') {
        figma.showUI(__uiFiles__.about);
    }
    if (msg.type === 'main') {
        figma.showUI(__uiFiles__.main);
    }
    //TODO create an html for howto with video screen shots
    if (msg.type === 'howto') {
        figma.showUI(__uiFiles__.main);
    }
    if (msg.type === 'apply-color') {
        applyColors(figma.currentPage.selection);
    }
};
const notifyUser = (msg) => {
    if (uiVisible === true) {
        figma.ui.postMessage(msg);
    }
    else {
        figma.notify(msg);
    }
};
function clone(val) {
    return JSON.parse(JSON.stringify(val));
}
const randomColor = () => {
    const random = () => Number.parseFloat(Math.random().toPrecision(2));
    return { r: random(), g: random(), b: random() };
};
const applyColors = (selection) => {
    try {
        let selectionCount = 0;
        for (const node of selection) {
            if ('fills' in node) {
                selectionCount += 1;
                const r = clone(node.fills);
                r[0].color = randomColor();
                node.fills = r;
            }
        }
        if (selectionCount === 0) {
            notifyUser('❌ object has no fill');
        }
        else {
            notifyUser(`🌈 applied to ${selectionCount} items`);
        }
    }
    catch (error) {
        notifyUser(error.message);
    }
};
