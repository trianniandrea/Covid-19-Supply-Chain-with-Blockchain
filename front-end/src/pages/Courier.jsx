
import { Link } from "react-router-dom";
import React, { Component } from 'react'
import Web3 from 'web3'

import CovidSupplyChain from "../CovidSupplyChain.json";

import './css/timeline.css';
import './css/tables.css';
import './css/App.css';

import * as utils from "./Utils.jsx";


class CourierPage extends Component {
  // aggiungi al dizionario state quante piu informazioni vuoi

  constructor() 
  {
    super();
    this.batch_id=0;

    this.state = {
      account:"", 
      loaded:false,
      temp:0,
      size:64,
      history: {'ids':Array(),'status':Array(), 'sizes': Array(), 'temps':Array()}
    };

  }

  // qui ci si connette alla blockchain
  componentDidMount = async () => {
    try 
    {
      const web3 = new Web3(window.web3.currentProvider)
  
      const accounts = await web3.eth.getAccounts()
      this.setState({ account: accounts[0] })

      const networkId = await web3.eth.net.getId();

      this.CovidSupplyChain = new web3.eth.Contract( 
        CovidSupplyChain.abi,
        CovidSupplyChain.networks[networkId] && CovidSupplyChain.networks[networkId].address 
      );
      
      const batch = await this.CovidSupplyChain.methods.getMyLastNBatch(3,this.state.account).call();
      this.state.history['ids'] = Array.from(batch[0]);
      this.state.history['status'] = Array.from(batch[1]);
      this.state.history['sizes'] = Array.from(batch[2]);
      this.state.history['temps'] = Array.from(batch[3]);

      this.setState({loaded:true});
    } 
    catch (error) 
    {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  }

  onSubmitForm = async () => {
    //console.log(this.actor_name,this.role);

    //chiamata in scrittura .send(indirizzo mittente) 
    let result = await this.CovidSupplyChain.methods.updateStatus (this.batch_id).send({ from: this.state.account });
    console.log(result); // in result trovi l evento emesso dal contratto

  };

  onIdChange = (event) => {this.batch_id= event.target.value;}

  //qui si stampa l html dinamico usando anche le varibili dichiarate sopra
  render() {
    return (
      <div>

      <div class="titolo"> 
        <p>Courier Landing Page </p> 
        <Link to="/" class="back"> Back to home</Link>
      </div>

      <div class="homepage"> 
        <div class="page-content">          
          
        <br></br> <i class="material-icons" >account_circle </i> <br></br>

        <p id="table-title">History Dashboard</p>

        <table class="fl-table">
        <tbody>
          <tr>
            <th> Batch ID </th>
            <th> Batch Status </th>
            <th> Batch Temp° </th>
            <th> Batch Size </th>
            <th> Search </th>
          </tr>
          {this.state.history['ids'].map((id,index) => (
          <tr>
            <td> {utils.pad(id,8)} </td>
            <td> {utils.BatchStatus[this.state.history['status'][index]]} </td>
            <td> {this.state.history['temps'][index]} </td>
            <td> {this.state.history['sizes'][index]} </td>
            <td> <Link to="/scan" class="link"> &#128269;</Link> </td>
          </tr>
          ))}
        </tbody>
        </table>

        <div class="action">
            <p id="table-title"> Update Batch Status</p>
            <center><p class="action-subtitle">(New status is automatically understood by the system.)</p></center>

            <form onSubmit={this.formSubmit}>
              <input type="text" name="cost"  id="small-tf" placeholder="Insert Batch Id.." onChange={this.onIdChange}/>
              <button  class="button" type="button" onClick={this.onSubmitForm}>Update</button>
            </form>

            <br></br>
        </div>




        </div>
      </div>

      </div>      
   
    );
  }
  
}

export default CourierPage;