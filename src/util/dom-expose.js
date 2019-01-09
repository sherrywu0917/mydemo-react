/*
* dom元素曝光逻辑
* 1）整个Banner大于50%露出，计算一次曝光量
* 2）上下滑分别展示出2次，计算为2次曝光（Banner露出50%）
* 3）停留时间大于0.5秒，开始计算曝光
*/
import {topPosition} from 'tool'

class DomExpose{
    constructor(props) {
        this.dom = props.dom;
        this.callback = props.callback;
        this.hiddenCallback = props.hiddenCallback;
        this.isExpose = false;

        this.checkExpose = this.checkExpose.bind(this);
        this.init();
    }

    init() {
        this.checkExpose();
        window.addEventListener('scroll', this.checkExpose, false);
    }

    checkExpose() {
        let timeout1;
        let domHeight = this.dom.offsetHeight;
        let winHeight = window.innerHeight;
        if(window.pageYOffset + winHeight >= topPosition(this.dom) + domHeight / 2 && window.pageYOffset <= topPosition(this.dom) + domHeight) {
            if(this.isExpose) return;
            this.isExpose = true;
            timeout1 = setTimeout(() => {
                this.callback && this.callback();
                clearTimeout(timeout1)
            }, 500)
        }
        else if(this.isExpose && (window.pageYOffset + winHeight < topPosition(this.dom) || window.pageYOffset > topPosition(this.dom) + domHeight)) {
            this.isExpose = false;
            this.hiddenCallback && this.hiddenCallback();
            clearTimeout(timeout1)
        }
    }

    unload() {
        window.removeEventListener('scroll', this.checkExpose, false);
    }
}

const initDomExpose = function(props) {
    return new DomExpose(props)
}

export {initDomExpose}
