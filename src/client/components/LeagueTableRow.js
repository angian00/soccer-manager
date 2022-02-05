
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
library.add(faTrashAlt)
library.add(faEdit)
library.add(faEye)


export default class LeagueTableRow extends Component {
	constructor(props) {
		super(props);
		this.delete = this.delete.bind(this);
	}
	
	delete() {
		axios.post("http://localhost:8080/api/league/" + this.props.obj.id + "/delete")
			.then(res => {
				console.log(res.data);
				this.props.handleDelete(this.props.obj.id);
				//this.props.history.push('/indexLeague');
			})
			.catch(err => console.log(err));
	}

	render() {
		return (
			<tr>
				<td> {this.props.obj.id} </td>
				<td> {this.props.obj.name} </td>
				<td> {this.props.obj.description} </td>
				<td>
					<Link to={"/viewLeague/"+this.props.obj.id} className="btn btn-success mr-2"><FontAwesomeIcon icon="eye" /></Link>
					<Link to={"/editLeague/"+this.props.obj.id} className="btn btn-primary mr-2"><FontAwesomeIcon icon="edit" /></Link>
					<button onClick={this.delete} className="btn btn-danger"><FontAwesomeIcon icon="trash-alt" /></button>
				</td>
			</tr>
		);
	}
}
