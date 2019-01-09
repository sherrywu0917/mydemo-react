import {MODE} from 'constant';

const filterSpace = str => (
    str && str.replace(/[\n\r]+/g, ' ').replace(/\t/g, ' ').replace(/<p>/ig, '').replace(/<\/p>/ig, '')
)

const localParam = () => {
    const {search} = window.location;
    const reg = new RegExp('([^?=&]+)(=([^&]*))?', 'g');
    const data = {};
    if (search) {
        search.replace(reg, ($0, $1, $2, $3) => {
            data[$1] = $3;
        });
    }
    return data;
}

// dom元素距离顶部的距离
const topPosition = (domEle, accum = 0) => {
    if (!domEle) {
        return accum;
    }
    accum += domEle.offsetTop;
    return topPosition(domEle.offsetParent, accum);
}

// 缓动到某位置
const linearScrollTo = (yAxis, duration = 500) => {
    const startTime = +new Date();
    const oTop = window.pageYOffset;
    const dis = yAxis - oTop;
    let timer = requestAnimationFrame(function func() {
        const t = duration - Math.max(0, startTime + duration - (+new Date()));
        window.scrollTo(0, t * dis / duration + oTop)
        timer = requestAnimationFrame(func);
        if (t === duration) {
            cancelAnimationFrame(timer);
        }
    });
}


export {
    filterSpace,
    localParam,
    topPosition,
    linearScrollTo
}
