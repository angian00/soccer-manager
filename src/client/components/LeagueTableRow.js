
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


export default class LeagueTableRow extends Component {
	constructor(props) {
		super(props);
		this.delete = this.delete.bind(this);
	}
	
	delete() {
		axios.post('http://localhost:8080/api/league/delete/'+this.props.obj.id)
			.then(res => console.log(res.data))
			.catch(err => console.log(err));
	}

	render() {
		return (
			<tr>
				<td> {this.props.obj.id} </td>
				<td> {this.props.obj.name} </td>
				<td> {this.props.obj.description} </td>
				<td> <Link to={"/editLeague/"+this.props.obj.id} className="btn btn-primary">Edit</Link> </td>
				<td> <button onClick={this.delete} className="btn btn-danger">Delete</button> </td>
			</tr>
		);
	}
}
