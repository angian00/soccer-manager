import React, { Component } from 'react';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import axios from 'axios';


export default class ViewLeague extends Component {
	constructor(props) {
		super(props);

		this.state = { name: "", description: "", year: 0, Teams: [], 
			results: [], schedule: [], scoreboard: [] };

		this.onNewYear = this.onNewYear.bind(this);
		this.onSimulateDay = this.onSimulateDay.bind(this);
	}

	componentDidMount() {
		axios.get('http://localhost:8080/api/league/'+this.props.match.params.id + "?computeScoreboard=true")
			.then(response => {
				console.log(response.data);
				this.setState(response.data);
		})
			.catch(function (error) {
				console.log(error);
		});
	}

	onNewYear() {
		axios.post("http://localhost:8080/api/league/" + this.props.match.params.id + "/newYear")
			.then(res => {
				console.log(res.data);
				this.props.history.push('/viewLeague/' + this.props.match.params.id);
			})
			.catch(err => console.log(err));
	}

	onSimulateDay() {
		axios.post("http://localhost:8080/api/league/" + this.props.match.params.id + "/newDay")
			.then(res => {
				console.log(res.data);
				this.props.history.push('/viewLeague/' + this.props.match.params.id);
			})
			.catch(err => console.log(err));
	}


	render() {
		return (
			<div style={{ marginTop: 10 }}>
				<h2>{this.state.name}</h2>
				<p>{this.state.description}</p>

				<p>
					<button onClick={this.onNewYear} className="btn btn-lg btn-primary">New Season</button>
					<button onClick={this.onSimulateDay} className="btn btn-lg btn-warning">Generate Next Results</button>
				</p>
	
				{ (this.state.currYear) &&
					<h3>Season {this.state.currYear} </h3>
				}

				{ (this.state.currYear) &&
					<Tabs defaultActiveKey="scoreboard">
						<Tab eventKey="scoreboard" title="Scoreboard">
							<table id="scoreboardTable" className="table table-sm table-striped">
								<thead className="thead-dark">
									<tr>
										<th scope="col">&nbsp;</th>
										<th scope="col">&nbsp;</th>
										<th scope="col">points</th>
										<th scope="col">G</th>
										<th scope="col">W</th>
										<th scope="col">D</th>
										<th scope="col">L</th>
										<th scope="col">GF</th>
										<th scope="col">GA</th>
									</tr>
								</thead>
								<tbody>
									{ this.renderScoreboard() }
								</tbody>
							</table>
						</Tab>

						<Tab eventKey="results" title="Results">
							<div className="card-deck">
								{ this.renderResults() }
							</div>
						</Tab>

						<Tab eventKey="schedule" title="Schedule">
							<div className="card-deck">
								{ this.renderSchedule() }
							</div>
						</Tab>
					</Tabs>
				}
			</div>
		)
	}

	renderScoreboard() {
		return this.state.scoreboard.map((teamScore, i) => {
			return <tr key={i} >
				<th scope="row"> {i+1} </th>
				<td> {teamScore.team} </td>
				<td> {teamScore.nPoints} </td>
				<td> {teamScore.nPlayed} </td>
				<td> {teamScore.nWon} </td>
				<td> {teamScore.nDrawn} </td>
				<td> {teamScore.nLost} </td>
				<td> {teamScore.goalsFor} </td>
				<td> {teamScore.goalsAgainst} </td>
			</tr>;
		})
	}

	renderResults() {
		return Object.keys(this.state.results).sort().map((day, i) => {
			let dayFixtures = this.state.results[day];

			return <FixtureCard key={day} day={day} obj={dayFixtures} />;
		});
	}

	renderSchedule() {
		return Object.keys(this.state.schedule).map((day, i) => {
			let dayFixtures = this.state.schedule[day];

			return <FixtureCard key={day} day={day} obj={dayFixtures} />;
		});
	}

}


class FixtureCard extends Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<div className="card" style={{ minWidth: "20em", maxWidth: "20em" }}>
				<table className="table table-sm table-results">
					<thead className="thead-light">
						<tr><th colSpan="3">Day {this.props.day}</th></tr>
					</thead>
					<tbody>
						{ this.renderFixtureRows() }
					</tbody>
				</table>
			</div>
		);
	}

	renderFixtureRows() {
		return this.props.obj.map((fixture, i) => {
			return <tr key={i}>
				<td> {fixture.homeTeam} </td>
				{ (fixture.homeGoals === null) ? (
					<td>&mdash;</td>
				) : (
					<td> {fixture.homeGoals} &ndash; {fixture.visitorGoals} </td>
				)}
				<td> {fixture.visitorTeam} </td>
			</tr>;
		});
	}
}
