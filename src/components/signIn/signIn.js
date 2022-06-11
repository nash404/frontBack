import { setErrors } from "../../reducers/errors";
import { useDispatch } from "react-redux";
import React, { useState } from "react";
import Errors from "../errors/errors";
import Validation from "../../modules/validationForms";
import { useNavigate } from "react-router-dom";
function SignIn() {
  const sendDataAboutUser = async (data) => {
    let response = await fetch(
      "https://blognode-heroku.herokuapp.com/api/post/signInUser/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ data: data }),
      }
    );
    let result = await response.json();

    if (result.token.length === 0) {
      dispatch(setErrors(result.errors));
      return;
    }
    localStorage.setItem("token", result.token);
    navigate("/");
  };

  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
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
    ];

    let result = Validation(data);
    if (result.status) {
      sendDataAboutUser({ name: username, password: password });
      return;
    }

    dispatch(setErrors(result.errors));
  };
  return (
    <div>
      <div className="center">
        <div className="signUpMain">
          <div className="widthMain">
            <p>Sign In</p>
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
            <button onClick={submitValue}>Next</button>
          </div>
        </div>
      </div>
      <Errors />
    </div>
  );
}

export default SignIn;
