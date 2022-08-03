import React from 'react';
import ReactDOM from 'react-dom';
import Modeler from './Modeler';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Modeler />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister(); 

// changing to register() allows an opt-in only Progressive Web App
// Progressive Web Apps are offline-first and isntallable
// user can install the app on any device and it'll load faster etc.
