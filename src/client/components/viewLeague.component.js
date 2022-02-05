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
	
		this.onSortScoreboard = this.onSortScoreboard.bind(this);
	}

	componentDidMount() {
		axios.get('http://localhost:8080/api/league/'+this.props.match.params.id + "?computeScoreboard=true")
			.then(res => {
				console.log(res.data);
				this.setState(res.data);
		})
			.catch(function (error) {
				console.log(error);
		});
	}

	onNewYear() {
		axios.post("http://localhost:8080/api/league/" + this.props.match.params.id + "/newYear")
			.then(res => {
				console.log(res.data);
				//this.setState(res.data);
				window.location.reload();
			})
			.catch(err => console.log(err));
	}

	onSimulateDay() {
		axios.post("http://localhost:8080/api/league/" + this.props.match.params.id + "/newDay")
			.then(res => {
				console.log(res.data);
				//this.setState(res.data);
				window.location.reload();
			})
			.catch(err => console.log(err));
	}


	onSortScoreboard(sortKey) {
		const scoreboardData = this.state.scoreboard;
		scoreboardData.sort( (a,b) => (
			(typeof a[sortKey]) == "string") 
			? a[sortKey].localeCompare(b[sortKey]) 
			: b[sortKey] - a[sortKey]
		);

		this.setState({ scoreboard: scoreboardData });
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
							<table id="scoreboardTable" className="table table-sm table-striped table-responsive-sm" style={{ width: "100%"}}>
								<thead className="thead-dark">
									<tr className="d-flex">
										<th scope="col" className="col-1">&nbsp;</th>
										<th scope="col" className="col-4" onClick={e => this.onSortScoreboard('team')}>team name</th>
										<th scope="col" className="col-1" onClick={e => this.onSortScoreboard('nPoints')}>pts</th>
										<th scope="col" className="col-1" onClick={e => this.onSortScoreboard('nPlayed')}>G</th>
										<th scope="col" className="col-1" onClick={e => this.onSortScoreboard('nWon')}>W</th>
										<th scope="col" className="col-1" onClick={e => this.onSortScoreboard('nDrawn')}>D</th>
										<th scope="col" className="col-1" onClick={e => this.onSortScoreboard('nLost')}>L</th>
										<th scope="col" className="col-1" onClick={e => this.onSortScoreboard('goalsFor')}>GF</th>
										<th scope="col" className="col-1" onClick={e => this.onSortScoreboard('goalsAgainst')}>GA</th>
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
			return <tr key={i} className="d-flex">
				<th scope="row" className="col-1"> {i+1} </th>
				<td className="col-4"> {teamScore.team} </td>
				<td className="col-1"> {teamScore.nPoints} </td>
				<td className="col-1"> {teamScore.nPlayed} </td>
				<td className="col-1"> {teamScore.nWon} </td>
				<td className="col-1"> {teamScore.nDrawn} </td>
				<td className="col-1"> {teamScore.nLost} </td>
				<td className="col-1"> {teamScore.goalsFor} </td>
				<td className="col-1"> {teamScore.goalsAgainst} </td>
			</tr>;
		})
	}

	renderResults() {
		let days = Object.keys(this.state.results).sort( (d1, d2) => (parseInt(d1) > parseInt(d2)) );

		return days.map((day, i) => {
			let dayFixtures = this.state.results[day];

			return <FixtureCard key={day} day={day} obj={dayFixtures} />;
		});
	}

	renderSchedule() {
		let days = Object.keys(this.state.schedule).sort( (d1, d2) => (parseInt(d1) > parseInt(d2)) );

		return days.map((day, i) => {
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
