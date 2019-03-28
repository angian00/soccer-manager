import React, { Component } from 'react';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import axios from 'axios';


export default class ViewLeague extends Component {
	constructor(props) {
		super(props);

		this.state = { name: "", description: "", year: 0, Teams: [] };
	}

	componentDidMount() {
		axios.get('http://localhost:8080/api/league/'+this.props.match.params.id)
			.then(response => {
				console.log(response.data);
				//this.setState({ name: response.data.name, description: response.data.description });
				this.setState(response.data);
		})
			.catch(function (error) {
				console.log(error);
		});
	}

	render() {
		return (
			<div style={{ marginTop: 10 }}>
				<h2>{this.state.name}</h2>
				<p>{this.state.description}</p>
				<h3>year {this.state.currYear}</h3>

				<br />

				<Tabs defaultActiveKey="scoreboard">
					<Tab eventKey="scoreboard" title="Scoreboard">
						<table className="table table-striped">
							<tbody>
								{
									this.state.Teams.map((team, i) => {
										return <tr key={i} ><td> {i+1} </td><td> {team.name} </td></tr>;
										//TODO: ranking fields
									})
								}
							</tbody>
						</table>
					</Tab>

					<Tab eventKey="results" title="Results">
						<div className="card" style={{ width: "20em" }}>
							<table className="table table-sm table-results">
								<thead className="thead-light">
									<tr><th colSpan="3">Day 2</th></tr>
								</thead>
								<tbody>
									<tr><td>Atalanta</td><td>1-1</td><td>Bologna</td></tr>
									<tr><td>Cagliari</td><td>2-0</td><td>Verona</td></tr>
									<tr><td>Atalanta</td><td>1-1</td><td>Bologna</td></tr>
									<tr><td>Cagliari</td><td>2-0</td><td>Verona</td></tr>
									<tr><td>Atalanta</td><td>1-1</td><td>Bologna</td></tr>
									<tr><td>Cagliari</td><td>2-0</td><td>Verona</td></tr>
									<tr><td>Atalanta</td><td>1-1</td><td>Bologna</td></tr>
									<tr><td>Cagliari</td><td>2-0</td><td>Verona</td></tr>
									<tr><td>Atalanta</td><td>1-1</td><td>Bologna</td></tr>
									<tr><td>Cagliari</td><td>2-0</td><td>Verona</td></tr>
								</tbody>
							</table>
						</div>

						<div className="card" style={{ width: "20em" }}>
							<table className="table table-sm table-results">
								<thead className="thead-light">
									<tr><th colSpan="3">Day 1</th></tr>
								</thead>
								<tbody>
									<tr><td>Cagliari</td><td>2-0</td><td>Verona</td></tr>
									<tr><td>Atalanta</td><td>1-1</td><td>Bologna</td></tr>
									<tr><td>Cagliari</td><td>2-0</td><td>Verona</td></tr>
									<tr><td>Atalanta</td><td>1-1</td><td>Bologna</td></tr>
									<tr><td>Cagliari</td><td>2-0</td><td>Verona</td></tr>
									<tr><td>Atalanta</td><td>1-1</td><td>Bologna</td></tr>
									<tr><td>Cagliari</td><td>2-0</td><td>Verona</td></tr>
									<tr><td>Atalanta</td><td>1-1</td><td>Bologna</td></tr>
									<tr><td>Cagliari</td><td>2-0</td><td>Verona</td></tr>
									<tr><td>Atalanta</td><td>1-1</td><td>Bologna</td></tr>
									<tr><td>Cagliari</td><td>2-0</td><td>Verona</td></tr>
									<tr><td>Atalanta</td><td>1-1</td><td>Bologna</td></tr>
									<tr><td>Cagliari</td><td>2-0</td><td>Verona</td></tr>
									<tr><td>Atalanta</td><td>1-1</td><td>Bologna</td></tr>
								</tbody>
							</table>
						</div>
					</Tab>

					<Tab eventKey="schedule" title="Schedule">
					</Tab>
				</Tabs>
			</div>
		)
	}
}
