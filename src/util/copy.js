import clipboard from 'clipboard-polyfill'
import {showMessage} from '@/component/common/toast/toast'

export function copy (text, callback) {
    clipboard.writeText(text).then(() => {
        showMessage({text: '复制成功'})
        callback && callback();
    }).catch(() => {
        showMessage({text: '复制失败，请手动复制'})
        callback && callback();
    })
}
