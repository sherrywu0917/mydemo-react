import React, {Component} from 'react'
import 'indexApp.scss'

/* =============
 首页
 ============== */
export default class IndexApp extends Component {
    constructor() {
        super();
        this.name = 'sandwich';
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="g-wrap" id="IndexApp">
                hello {this.name} ^_^
            </div>
        )
    }
}
