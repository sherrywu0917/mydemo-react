
const numberUtils = {
    padLeft(num, fill) {
        const len = ('' + num).length;
        return (Array(
            fill > len ? fill - len + 1 || 0 : 0
        ).join(0) + num);
    }
}

export {numberUtils}
