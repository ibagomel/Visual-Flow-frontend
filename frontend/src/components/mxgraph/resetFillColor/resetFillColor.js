import { selectFillColor } from './selectFillColor';

// eslint-disable-next-line import/prefer-default-export
export const resetFillColor = (graph, data) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, val] of Object.entries(graph.model.cells)) {
        if (val.vertex && data.definition.graph) {
            const currentStage = data?.definition.graph.find(
                item => item.id === key
            );
            if (currentStage) {
                graph.setCellStyles(
                    'fillColor',
                    selectFillColor(currentStage.style),
                    [val]
                );
            }
        }
    }
};
