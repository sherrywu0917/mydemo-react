{% set capName = name | replace(name | first, name | first | upper, 1)%}
import React from 'react';
import {render} from 'react-dom';
import {{capName}}App from '@/component/{{name}}App.jsx';
import '@/style/comm.scss';

render(<{{capName}}App/>, document.getElementById('root'));
