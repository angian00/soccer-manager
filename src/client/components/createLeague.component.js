import React, { Component } from 'react';
import axios from 'axios';


export default class CreateLeague extends Component {
	constructor(props) {
		super(props);
		this.onChangeName = this.onChangeName.bind(this);
		this.onChangeDescription = this.onChangeDescription.bind(this);
		this.onSubmit = this.onSubmit.bind(this);

		this.state = { name: "", description: "" };
	}

	onChangeName(e) {
		this.setState({ name: e.target.value });
	}

	onChangeDescription(e) {
		this.setState({ description: e.target.value });
	}

	onSubmit(e) {
		e.preventDefault();
		const obj = {
			name: this.state.name,
			description: this.state.description
		};

		//TODO: add team fields to html
		let teams = [];
		for (let i=0; i < 20; i ++) {
			teams.push("T" + i);
		}
		//obj.teams = teams;
		//

		axios.post('http://localhost:8080/api/league/create', obj)
			.then(res => console.log(res.data));

		this.setState({ name: "", description: "" });
	}
	
	render() {
		return (
			<div style={{marginTop: 10}}>
				<h3>Add New League</h3>
				
				<form onSubmit={this.onSubmit}>
					<div className="form-group">
						<label>Name:  </label>
						<input
							type="text" className="form-control"
							value={this.state.name}
							onChange={this.onChangeName}
					/>
					</div>
		
					<div className="form-group">
						<label>Description: </label>
						<input type="text" className="form-control"
							value={this.state.description}
							onChange={this.onChangeDescription}
						/>
					</div>
			
					<div className="form-group">
						<input type="submit" value="Create League" className="btn btn-primary"/>
					</div>
				</form>
			</div>
		)
	}
}
