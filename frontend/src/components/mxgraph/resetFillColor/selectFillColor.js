// eslint-disable-next-line import/prefer-default-export
export const selectFillColor = style =>
    style
        .match(/fillColor=#[0-9a-fA-F]{6}/)[0]
        .split('=')
        .pop();
