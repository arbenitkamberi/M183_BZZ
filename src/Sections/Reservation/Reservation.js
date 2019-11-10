import React, { Component } from 'react';

import axios from 'axios';

import {WithContext} from '../../App.js';
import {validateReservation} from '../../Validators/Validators.js';

import './Reservation.css';

class Reservation extends Component {

    constructor(props){
        super(props);

        this.state = {
            reservation: {
                datum: "",
                uhrzeit: "",
                dauer: "empty",
                nachricht: "",
            },
            invalidFields: [],
            message: null
        };

        this.setDatum = this.setDatum.bind(this);
        this.setUhrzeit = this.setUhrzeit.bind(this);
        this.setDauer = this.setDauer.bind(this);
        this.setNachricht = this.setNachricht.bind(this);
        this.submit = this.submit.bind(this);
    }

    setDatum(event){
        this.setState({...this.state, reservation: {...this.state.reservation, datum: event.target.value}});
    }

    setUhrzeit(event){
        this.setState({...this.state, reservation: {...this.state.reservation, uhrzeit: event.target.value}});
    }

    setDauer(event){
        this.setState({...this.state, reservation: {...this.state.reservation, dauer: event.target.value}});
    }

    setNachricht(event){
        this.setState({...this.state, reservation: {...this.state.reservation, nachricht: event.target.value}});
    }

    submit(event){
        let invalidFields = validateReservation(this.state.reservation);
        if(invalidFields.length === 0){
            axios({
                method: "post",
                url: `http://${window.location.hostname}:8080/neueReservation`,
                withCredentials: true,
                data: {...this.state.reservation}
            }).then(res => {
                this.setState({...this.state, message: "OK", invalidFields: []});
            }).catch(error => {
                console.log(error);
                if(error.response && error.response.status === 400){
                    this.setState({...this.state, message: null, invalidFields: error.response.data});
                }
                if(error.response && error.response.status === 403){
                    this.setState({...this.state, message: "Sie sind nicht eingeloggt", invalidFields: []});
                }
                else{
                    this.setState({...this.state, message: "Es ist ein Fehler unterlaufen", invalidFields: []});
                }
            });
        }
        else{
            this.setState({...this.state, message: null, invalidFields});
        }
    }

    render() {
        if(this.props.context.role !== "USER"){
            return null;
        }
        return (
            <div className="reservationContainer">
                <div>
                    <form>
                        <table>
                            <tbody>
                                <tr className={this.state.message === "OK" ? "okMsg" : "errorMsg"}><td colSpan={2}>{this.state.message}</td></tr>
                                <tr>
                                    <td>Datum</td>
                                    <td><input type="date" value={this.state.reservation.datum} onChange={this.setDatum}></input></td>
                                    <td className="errorMsg">
                                        {this.state.invalidFields.includes("datum") ?
                                            "Es muss ein Datum ausgewählt werden" : null
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td>Uhrzeit:</td>
                                    <td><input type="time" value={this.state.reservation.uhrzeit} onChange={this.setUhrzeit}></input></td>
                                    <td className="errorMsg">
                                        {this.state.invalidFields.includes("uhrzeit") ?
                                            "Es muss eine Uhrzeit ausgewählt werden" : null
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td>Schätzungsdauer (optional):</td>
                                    <td>
                                        <select value={this.state.reservation.dauer} onChange={this.setDauer}>
                                            <option value="empty"></option>
                                            <option value="15m">15 Minuten</option>
                                            <option value="30m">30 Minuten</option>
                                            <option value="45m">45 Minuten</option>
                                            <option value="60m">60 Minuten</option>
                                            <option value="mehr">Mehr</option>
                                        </select>
                                    </td>
                                    <td className="errorMsg">
                                        {this.state.invalidFields.includes("dauer") ?
                                            "Es wurde ein ungültiger Wert ausgewählt" : null
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td>Nachricht (optional):</td>
                                    <td><textarea value={this.state.reservation.nachricht} onChange={this.setNachricht} maxlength="250" placeholder="Maximal 250 Zeichen"></textarea></td>
                                    <td className="errorMsg">
                                        {this.state.invalidFields.includes("nachricht") ?
                                            "Nachricht darf nicht länger als 250 Zeichen sein" : null
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td><div className="button" onClick={this.submit}>Reservation absenden</div></td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
            </div>
        );
    }
}

export default WithContext(Reservation);
