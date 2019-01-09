import {numberUtils} from 'number-utils'

const timeUtils = {
    getDays(totalMs) {
        return Math.floor(totalMs / (1000 * 60 * 60 * 24))
    },

    getHours(totalMs) {
        return Math.floor(totalMs / (1000 * 60 * 60)) % 24;
    },

    getMinutes(totalMs) {
        return Math.floor(totalMs / (1000 * 60)) % 60;
    },

    getSeconds(totalMs) {
        return Math.floor(totalMs / 1000) % 60;
    },

    getMilliSeconds(totalMs) {
        return (totalMs % 1000);
    },

    format(totalMs, splitChar = '.') {
        if (isNaN(parseInt(totalMs))) return;
        const date = new Date(parseInt(totalMs));
        return date.getFullYear() + splitChar + numberUtils.padLeft(date.getMonth() + 1, 2) + splitChar + numberUtils.padLeft(date.getDate(), 2)
    },

    formatMonth(totalMonth) {
        const _totalMonth = parseInt(totalMonth);
        if (isNaN(_totalMonth)) return;
        return _totalMonth % 12 === 0 ? `${_totalMonth / 12}年` : `${_totalMonth}个月`
    }
};

export {timeUtils};
