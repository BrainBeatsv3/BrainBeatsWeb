import React, { Component, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";



const RegisterCard = () => {
    //useStates to get required fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setdob] = useState("");
    const [stage, setStage] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');
    const [creationSuccess, setCreateSuccess] = useState('');


    const emptyField = () => {
        return (!email || !password || !username || !firstName || !lastName || !dob)
    }
    const createAccount = (event) => {
        //allows form to work without problems on start and submit
        event.preventDefault();
        if (emptyField()) {
            setErrorMsg("Fill out all fields please");
            return;
        }
        if (validateEmail()) {
            setErrorMsg("Invalid Email format");
            setStage(0);
            return;
        }

        //starting path for API endpoint
        const path = require('../Path');

        //put all input fields into a json object
        const newUser = {
            "firstName": firstName,
            "lastName": lastName,
            "dob": dob + 'T00:00:00.000Z', //Date format for SQL
            "email": email,
            "username": username,
            "password": password
        };
        //create a json to pass into axois
        let config = {
            method: "post",
            url: path.buildPath('/users/createUser'),
            headers: {
                "Content-Type": "application/json"
            },
            data: newUser
        };
        //axios command
        axios(config).then(function (res) {
            setCreateSuccess("Account Created!")

        })
            .catch(function (err) {
                setErrorMsg(err.response.data.msg);
            })
    }

    //Validates email field
    const validateEmail = (event) => {
        const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (regexp.test(email)) {
            return false;
        }
        else {
            return true;
        }
    }

    const nextStage = (e) => {
        e.preventDefault();
        if (!email || !username || !password) {
            setErrorMsg('Please Fill out all fields')
        }
        else {
            setStage(1)
            setErrorMsg('')
        }
    }
    //onSubmit={createAccount}
    return (
        <>
            <div class="box">
                <div class="form-box">
                    <div>
                        <form onSubmit={createAccount} style={{ textAlign: 'left' }}>
                            <div style={{ textAlign: 'center' }}>
                                <h2>Register</h2>
                            </div>
                            {stage == 0 && (
                                <>
                                    <div style={{ textAlign: 'center' }}>
                                        <h3>Account Information</h3>
                                    </div>
                                    <div className="form-group">
                                        <label>Email address<span className="asterisk">*</span></label>
                                        <input
                                            type="email"
                                            required
                                            className="form-control"
                                            placeholder="Enter email"
                                            value={email}
                                            onChange={(event) => setEmail(event.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Username<span className="asterisk">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Username"
                                            value={username}
                                            onChange={(event) => setUsername(event.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Password<span className="asterisk">*</span></label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(event) => setPassword(event.target.value)}
                                        />
                                    </div>
                                    <p className="errMsg">{errorMsg}</p>
                                    <div style={{ textAlign: 'right' }}>
                                        <Button type="button" className="" onClick={nextStage}>Next</Button>
                                    </div>
                                </>
                            )}
                            {stage == 1 && (
                                <>
                                    <div style={{ textAlign: 'center' }}>
                                        <h3>Personal Information</h3>
                                    </div>
                                    <div className="form-group">
                                        <label>First Name<span className="asterisk">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter First Name"
                                            value={firstName}
                                            onChange={(event) => setFirstName(event.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name<span className="asterisk">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Last Name"
                                            value={lastName}
                                            onChange={(event) => setLastName(event.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>DOB<span className="asterisk">*</span></label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            placeholder="Enter DOB"
                                            value={dob}
                                            onChange={(event) => setdob(event.target.value)}
                                        />
                                    </div>

                                    <p className="errMsg">{errorMsg}</p>
                                    <p>{creationSuccess}</p>

                                    <div id="HASH">
                                        <Button type="button" className='text-left' onClick={(e) => (e.preventDefault(), setStage(0))}>Prev</Button>
                                        <Button type="submit" className='text-right' >Submit</Button>
                                    </div></>
                            )}

                        </form>
                    </div>

                </div>
            </div>
        </>
    )
}

export default RegisterCard;