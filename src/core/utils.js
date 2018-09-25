export const leftPad = function(num, times = 2) {
    const str = '' + num;
    const pad = '0'.repeat(times);

    return pad.substring(0, pad.length - str.length) + str;
};
