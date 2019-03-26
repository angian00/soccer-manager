import React, { Component } from 'react';
import axios from 'axios';


export default class EditLeague extends Component {
	constructor(props) {
		super(props);
		this.onChangeName = this.onChangeName.bind(this);
		this.onChangeDescription = this.onChangeDescription.bind(this);
		this.onSubmit = this.onSubmit.bind(this);

		this.state = { name: "", description: "" };
	}

	componentDidMount() {
		axios.get('http://localhost:8080/api/league/'+this.props.match.params.id)
			.then(response => {
				this.setState({ name: response.data.name, description: response.data.description });
		})
			.catch(function (error) {
				console.log(error);
		});
	}

	onChangeName(e) {
		this.setState({ name: e.target.value });
	}

	onChangeDescription(e) {
		this.setState({ description: e.target.value })  
	}

	onSubmit(e) {
		e.preventDefault();
		const obj = {
			name: this.state.name,
			description: this.state.description
		};

		axios.post('http://localhost:8080/api/league/update/'+this.props.match.params.id, obj)
			.then(res => console.log(res.data));

		this.props.history.push('/indexLeague');
	}

	render() {
		return (
			<div style={{ marginTop: 10 }}>
				<h3 align="center">Edit League Details</h3>
		
				<form onSubmit={this.onSubmit}>
					<div className="form-group">
						<label className="text-muted">id #123</label>
					</div>

					<div className="form-group">
						<label>Name:  </label>
						<input 
							type="text" 
							className="form-control" 
							value={this.state.name}
							onChange={this.onChangeName}
						/>
					</div>

					<div className="form-group">
						<label>Description: </label>
						<input type="text" 
							className="form-control"
							value={this.state.description}
							onChange={this.onChangeDescription}
						/>
					</div>

					<br />

					<div className="form-group">
						<h4>Teams: </h4>
						<div className="row">
							<div className="col">
								<div className="row">
									<label className="col-sm-2 col-form-label-sm text-muted">id #127</label>
									<div className="input-group col-sm-10">
										<input type="text" className="form-control form-control-sm" value="Team 1" />
										<div className="input-group-append">
											<button className="btn btn-outline-secondary btn-sm form-control-sm" type="button">&times;</button>
										</div>
									</div>
								</div>
							</div>

							<div className="col">
								<div className="row">
									<label className="col-sm-2 col-form-label-sm text.right text-muted">id #333</label>
									<div className="input-group col-sm-10">
										<input type="text" className="form-control form-control-sm" value="Team 2" />
										<div className="input-group-append">
											<button className="btn btn-outline-secondary btn-sm form-control-sm" type="button">&times;</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<br />

					<div className="row justify-content-center">
						<div className="btn-group mr-3">
							<input type="submit"
								value="Update League"
								className="btn btn-primary"/>
						</div>

						<div className="btn-group">
							<input type="submit"
								value="Cancel"
								className="btn btn-secondary"/>
						</div>
					</div>

				</form>
			</div>
		)
	}
}