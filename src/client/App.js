import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFutbol } from '@fortawesome/free-solid-svg-icons';
library.add(faFutbol)


import './app.css';
import IndexLeague from './components/indexLeague.component';
import CreateLeague from './components/createLeague.component';
import EditLeague from './components/editLeague.component';
import ViewLeague from './components/viewLeague.component';


class DebugRouter extends Router {
	constructor(props){
		super(props);
		console.log('initial history is: ', JSON.stringify(this.history, null,2))
		this.history.listen((location, action) => {
			console.log(
				`The current URL is ${location.pathname}${location.search}${location.hash}`
			)
			console.log(`The last navigation action was ${action}`, JSON.stringify(this.history, null,2));
		});
	}
}

export default class App extends Component {
	render() {
		return (
			//<DebugRouter>
			<Router>
				<div className="container">
					<nav className="navbar navbar-expand-lg navbar-light bg-light">
						<Link to={'/'} className="navbar-brand"></Link>
						<div className="collapse navbar-collapse" id="navbarSupportedContent">
							<ul className="navbar-nav mr-auto">
								<li className="nav-item">
									<Link to={'/'} className="nav-link">Home</Link>
								</li>
								<li className="nav-item">
									<Link to={'/indexLeague'} className="nav-link">League Index</Link>
								</li>
								{/*<li className="nav-item">
									<Link to={'/createLeague'} className="nav-link">Create League</Link>
								</li>*/}
							</ul>
						</div>
					</nav>

					<br/>
					
					<h1><FontAwesomeIcon icon="futbol" /> Soccer League Manager</h1>

					<br/>
					
					<Switch>
						<Route path='/indexLeague' component={ IndexLeague } />
						<Route path='/createLeague' component={ CreateLeague } />
						<Route path='/editLeague/:id' component={ EditLeague } />
						<Route path='/viewLeague/:id' component={ ViewLeague } />
					</Switch>
				</div>
			</Router>
			//</DebugRouter>
		);
	}
}
