import "./signUp.css";
import { setErrors } from "../../reducers/errors";
import { useDispatch } from "react-redux";
import React, { useState } from "react";
import Errors from "../errors/errors";
import Validation from "../../modules/validationForms";

function SignUp() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const sendDataAboutUser = async (data) => {
    let response = await fetch(
      "https://blognode-heroku.herokuapp.com/api/post/signUpUser/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ data: data }),
      }
    );
    let result = await response.json();

    dispatch(setErrors(result));
  };

  const submitValue = async () => {
    const data = [
      {
        value: username,
        nameOfField: "name",
        typeOfValidation: ["void-validation"],
      },
      {
        value: password,
        nameOfField: "password",
        typeOfValidation: ["void-validation"],
      },
      {
        value: email,
        nameOfField: "email",
        typeOfValidation: ["void-validation", "email-validation"],
      },
    ];

    let result = Validation(data);
    if (result.status) {
      sendDataAboutUser({
        name: username,
        password: password,
        email: email,
      });
      return;
    }

    dispatch(setErrors(result.errors));
  };
  return (
    <div>
      <div className="center">
        <div className="signUpMain">
          <div className="widthMain">
            <p>Sign Up</p>
            <br />
            <input
              placeholder="Login"
              onChange={(event) => setUsername(event.target.value)}
            />
            <br />
            <br />
            <input
              placeholder="Password"
              type="text"
              onChange={(event) => setPassword(event.target.value)}
            />
            <br />
            <br />
            <input
              placeholder="Email"
              onChange={(event) => setEmail(event.target.value)}
            />
            <br />
            <br />
            <button onClick={submitValue}>Next</button>
          </div>
        </div>
      </div>

      <Errors />
    </div>
  );
}

export default SignUp;
