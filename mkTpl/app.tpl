import React, {Component} from 'react'

import '{{name}}App.scss'
{% set capName = name | replace(name | first, name | first | upper, 1)%}
export default class {{capName}}App extends Component {
    constructor() {
        super();

        initWxShare();
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="g-wrap" id="{{ name }}App">

            </div>
        )
    }

}
