import React, { useReducer } from 'react';
import './App.css';
import user from "./components/User.js"
import LoginForum from "./LoginForum"
import InputField from "./components/InputField"
import SubmitButton from "./components/SubmitButton"
import User from './components/User.js';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';
import { observer } from "mobx-react";
import Profile from "./components/Profile"
import axios from "axios";

class App extends React.Component {

  state = {
    htmlDisplay:""
  }

  async componentDidMount() {
    try {
      let res = await fetch("./isLoggedIn", {
        method: "post",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      });
      let result = await res.json();
      if (result && result.success) {
        User.loading = false;
        User.isLoggedIn = true;
        User.username = result.username;
        try {
          let res = await fetch("./displayData", {
            method: "post",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            }, body: JSON.stringify({
              username: User.username
            })
          });
          let result = await res.json();
          result = result.array1.arr
          var lengthOf, text, i;
          lengthOf = result.length;
          text = "<ul>";
          for (i = 0; i < lengthOf; i++) {
            text += "<li>" + "<center>" + result[i][0] + "<center/>"+"<br/>"+ '<center><iframe width="420" height="315" src="' +result[i][1] + '"></iframe><center/>' + "<p>"+result[i][2] +"<p/>"+  "</li>";
          }
          text += "</ul>";
          document.getElementById("demo").innerHTML = text;
        }
        catch (e) {

        }
      }
      else {
        User.loading = false;
        User.isLoggedIn = false;
      }
    }
    catch (e) {
      User.loading = false;
      User.isLoggedIn = false;
    }
  }

  async doLogout() {
    try {
      let res = await fetch("./logout", {
        method: "post",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      });
      let result = await res.json();
      if (result && result.success) {
        User.isLoggedIn = false;
        User.username = "";
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  async doInsert() {
    try {
      let res = await fetch("./doInsertData1", {
        method: "post",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      });
      let result = await res.json();
    }
    catch (e) {
      console.log(e)
    }
  }

  async doSubmit() {
    var inputVal1 = document.getElementById("item1").value;
    var inputVal2 = document.getElementById("item2").value;
    var inputVal3 = document.getElementById("item3").value;
    if (inputVal1 == "") {
      return;
    }
    if (inputVal2 == "") {
      return;
    }
    if (inputVal3 == "") {
      return;
    }
    this.setState({
      buttonDisabled: true
    })
    try {
      let res = await fetch("/doInsertData1", {
        method: "post",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: User.username,
          item1: inputVal1,
          item2: inputVal2,
          item3: inputVal3
        })
      });
    }
    catch (e) {
      console.log(e);
      this.resetForm();
    }
  }

  async doGet() {
    try {
      let res = await fetch("./doInsertData1", {
        method: "post",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      });
      let result = await res.json();
    }
    catch (e) {
      console.log(e)
    }
  }

  async doDisplay() { //test to display variables
    try {
      let res = await fetch("./displayData", {
        method: "post",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }, body: JSON.stringify({
          username: User.username
        })
      });
      let result = await res.json();
      document.getElementById("demo").innerHTML = result.arr;
      document.getElementById("demo").innerHTML = result.arr;
    }
    catch (e) {
      console.log(e)
    }
  }

  async doClear() { //clears entire arr list
    document.getElementById("demo").innerHTML = " ";
    try {
      let res = await fetch("./doClear", {
        method: "post",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }, body: JSON.stringify({
          username: User.username
        })
      });
      let result = await res.json();
      alert("hi2");
    }
    catch (e) {
      console.log(e)
    }
  }


  openForm() {
    document.getElementById("myForm").style.display = "block";
  }

  closeForm() {
    document.getElementById("myForm").style.display = "none";
  }


  render() {

    if (User.loading) {
      return (
        <div className="app">
          <div className="container">
            Loading..
            </div>
        </div>
      );
    }
    else {
      if (User.isLoggedIn) {
        return (
          <div className="app">
            <div className="Welcome" style={{display:"block",fontStyle:"bold"}}>
            &nbsp;&nbsp;&nbsp;Welcome, {User.username}
            </div>
            <div className="logoutButton">
              <SubmitButton text={"Log out"} disabled={false} onClick={() => this.doLogout()} />
            </div>
            <div class="clearButton">
            <SubmitButton text={"Clear List"} disabled={false} onClick={() => this.doClear()} />
            </div>
            <div className="button3">
            <SubmitButton text={"Insert New Song"} disabled={false} onClick={() => this.openForm()} />
            </div>
            <img src={require('./components/images/musicCatalystLogo.png')} alt="Music Catalyst" class="center"/>
            {this.state.htmlDisplay}
            <nav> <p id="demo"></p>
            <p id="blank"></p></nav>
            <div class="form-popup" id="myForm">
              <form class="form-container">
                <input type="text" placeholder="Title" id="item1" required></input>
                <input type="text" placeholder="Youtube Embeded Link" id="item2" required></input>
                <input type="text" placeholder="Lyrics" id="item3" required></input>
                <button type="submit" class="btn" onClick={() => this.doSubmit()}>Add Song</button>
                <button type="button" class="btn cancel" onClick={() => this.closeForm()}>Close</button>
              </form>
            </div>
          </div>
        );
      }

      return (
        <div className="app">
          <LoginForum />
        </div>

      );
    }
  }
}

export default observer(App);
