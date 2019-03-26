import React, { Component } from 'react';
import axios from 'axios';
import LeagueTableRow from './LeagueTableRow';


export default class IndexLeague extends Component {
	constructor(props) {
		super(props);
		this.state = {leagues: []};
	}

	componentDidMount() {
		axios.get('http://localhost:8080/api/league')
			.then(response => {
				this.setState({ leagues: response.data });
			})
			.catch(function (error) {
				console.log(error);
			})
	}

	tabRow() {
		return this.state.leagues.map(function(object, i) {
			return <LeagueTableRow obj={object} key={i} />;
		});
	}

	render() {
		return (
			<div>
				<h3 align="center">Available Leagues</h3>
				<table className="table table-striped" style={{ marginTop: 20 }}>
					<thead>
						<tr>
							<th>id</th>
							<th>name</th>
							<th>description</th>
							<th colSpan="2">action</th>
						</tr>
					</thead>
					<tbody>
						{ this.tabRow() }
					</tbody>
				</table>
			</div>
		);
	}
}
