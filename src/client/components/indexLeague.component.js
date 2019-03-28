import React, { Component } from 'react';
import axios from 'axios';
import LeagueTableRow from './LeagueTableRow';


export default class IndexLeague extends Component {
	constructor(props) {
		super(props);
		this.handleRowDelete = this.handleRowDelete.bind(this);

		this.state = {leagues: []};
	}

	componentDidMount() {
		axios.get("http://localhost:8080/api/leagues")
			.then(response => {
				this.setState({ leagues: response.data });
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	handleRowDelete(leagueId) {
		console.log("handleRowDelete");

		this.setState(prevState => ({
			leagues: prevState.leagues.filter(el => (el.id != leagueId))
			//leagues: prevState.leagues.filter(el.id => {return (el.id != leagueId); } )
			//leagues: prevState.leagues
		}));
	}

	tabRow() {
		return this.state.leagues.map((object, i) => {
			return <LeagueTableRow obj={object} key={i} handleDelete={this.handleRowDelete} />;
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
							<th colSpan="3">&nbsp;</th>
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
