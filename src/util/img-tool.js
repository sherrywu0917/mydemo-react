import {isSupportWebp} from 'nw-detect';

const _isSupportWebp = isSupportWebp();

const webpHelper = function (src) {
    if(!src) return src;
    (src.indexOf('?') > -1) && ( src = src.slice(0, src.indexOf('?')) );
    src += _isSupportWebp ? '?imageView&type=webp' : '?imageView'
    return src;
}

export {webpHelper}
