import "./menu.css";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Errors from "../errors/errors";
import { setErrors } from "../../reducers/errors";
import Modal from "react-modal";
import { setDatabase } from "../../reducers/datebase";
function Menu() {
  const nameColor = useSelector((state) => state.colours.colours);
  const searchRef = useRef(null);
  const [user, setUser] = useState(["none"]);
  const ref = useRef();
  const refTwo = useRef();

  const refThree = useRef();
  const refFour = useRef();
  const [stateOfWindow, setStateOfWindow] = useState("none");
  window.onclick = (event) => {
    if (event.target !== ref.current) setStateOfWindow("none");
    if (
      event.target === refTwo.current ||
      event.target === refThree.current ||
      event.target === refFour.current
    ) {
      showWindow();
      console.log("img");
    }
  };
  const sendDataAboutUser = async () => {
    let response = await fetch(
      `https://blognode-heroku.herokuapp.com/api/post/findAuthorizedUser?logMessage=${localStorage.getItem(
        "token"
      )}`
    );
    let result = await response.json();

    setUser(result);
  };
  const leaveFromAccount = () => {
    localStorage.setItem("token", " ");
    window.location.reload();
  };
  const showWindow = () => {
    if (stateOfWindow === "grid") setStateOfWindow("none");
    if (stateOfWindow === "none") setStateOfWindow("grid");
  };
  const dispatch = useDispatch();
  const searchArticle = async () => {
    if (window.location.pathname !== "/") return;
    let response = await fetch(
      "https://blognode-heroku.herokuapp.com/api/post/searchArticle/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          text: searchRef.current.value,
        }),
      }
    );
    let result = await response.json();
    dispatch(setDatabase(result));
  };
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }
  const openPro = async () => {
    openModal();
  };

  const newPhoto = useRef();
  const setPhoto = async (event) => {
    console.log(event.target.files[0]);
    const formData = new FormData();

    formData.append(
      "myFile",
      event.target.files[0],
      event.target.files[0].name
    );

    let result = await axios.post(
      "https://blognode-heroku.herokuapp.com/api/post/file",
      formData
    );
    setTimeout(() => {
      newPhoto.current.style.backgroundImage = `url(${result.data})`;
    }, 0);
  };

  function closeModal() {
    setIsOpen(false);
  }
  const refName = useRef();
  const setNewInfo = async () => {
    const fPart = newPhoto.current.style.backgroundImage.substring(
      5,
      newPhoto.current.style.backgroundImage.length
    );
    const sPart = fPart.substring(0, fPart.length - 2);
    let resPhoto = "";
    if (sPart !== user[0].img) resPhoto = sPart;
    let result = await axios.post(
      "https://blognode-heroku.herokuapp.com/api/post/setNew",
      {
        data: {
          name: refName.current.value,
          token: localStorage.getItem("token"),
          img: resPhoto,
        },
      }
    );
    dispatch(setErrors([result.data.err]));
  };
  useEffect(() => {
    sendDataAboutUser();
  }, [stateOfWindow]);
  const refLoad = useRef();
  const refArea = useRef();

  const dontAllowInput = () => {
    console.log(refArea.current.value.length);
    if (refArea.current.value.length > 90) {
      let value = refArea.current.value;
      refArea.current.value = value.substring(0, 90);
    }
  };
  return (
    <div>
      <Errors />
      <div>
        <div className="menu">
          <div className="firstPart">
            <div className="logo">
              <Link to="/" className="logoWithout">
                <p>.blognode</p>
              </Link>
            </div>
            <div className="searchField">
              <input
                onInput={searchArticle}
                ref={searchRef}
                id="infoFromSearchField"
                type="text"
                placeholder="Search"
              />
            </div>
          </div>
          <div className="secondPart">
            {user.map((item, index) => {
              if (item === "none")
                return (
                  <div className="singUpAndIn" key={index}>
                    <div className="signUp">
                      <Link to="/signUp" className="linkRegister">
                        Sign Up
                      </Link>
                    </div>
                    <div>
                      <Link to="/signIn" className="linkRegister">
                        Sign In
                      </Link>
                    </div>
                  </div>
                );
              else
                return (
                  <div key={index}>
                    <div className="userInfo" ref={refTwo}>
                      <img src={item.img} ref={refThree} width="35px" alt="" />
                      <p ref={refFour}>{item.name}</p>
                    </div>
                    <div
                      className="settignsAndSomething"
                      ref={ref}
                      style={{ display: stateOfWindow }}
                    >
                      <div className="point">
                        <p onClick={() => openPro()}>My profile</p>
                      </div>

                      <div className="point">
                        <Link to="/editor" className="publishLink">
                          <p>Post article</p>
                        </Link>
                      </div>
                      <div className="point">
                        <p onClick={leaveFromAccount}>Log out</p>
                      </div>
                    </div>
                  </div>
                );
            })}
          </div>
          <div className="menuLeft">
            <Link to="/" className="linkRegister">
              <p className="" style={{ color: nameColor[0] }}>
                Tape
              </p>
            </Link>
            <Link to="/subs" className="linkRegister">
              <p className="gray" style={{ color: nameColor[1] }}>
                Subscriptions
              </p>
            </Link>
            <Link to={"/saved?name=" + user[0].name} className="linkRegister">
              <p className="gray" style={{ color: nameColor[2] }}>
                Saved
              </p>
            </Link>
          </div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
          >
            <div className="profileData">
              <div className="profileImg">
                <div
                  ref={newPhoto}
                  style={{
                    width: "110px",
                    height: "110px",
                    backgroundImage: `url(${user[0].img})`,
                    backgroundSize: "cover",
                    borderRadius: "150px",
                  }}
                ></div>
              </div>
              <div className="allInfoPro">
                <div className="nameAndSubsProfile">
                  <p className="proName">{user[0].name}</p>
                  <p
                    className="setNewInfoPro"
                    onClick={() => refLoad.current.click()}
                  >
                    Set new image
                  </p>
                  <input
                    type="file"
                    ref={refLoad}
                    onChange={setPhoto}
                    style={{ display: "none" }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      width: "400px",
                      fontFamily: "Roboto",
                      fontWeight: 300,
                      lineHeight: 1.5,
                      marginTop: "10px",
                    }}
                  >
                    This is a brief summary, revealing all its main advantages,
                    general theme and benefits that
                  </p>
                </div>
              </div>
            </div>
            <div className="searchFieldPro">
              <input type="text" ref={refName} placeholder="Input new name" />
            </div>
            <div className="areaPro">
              <textarea
                onInput={dontAllowInput}
                ref={refArea}
                placeholder="Input new description"
                cols="20"
              ></textarea>
            </div>
            <button className="savePro" onClick={setNewInfo}>
              Save
            </button>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Menu;
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    padding: "30px",
    borderRadius: "20px",
    border: "1px solid #EAEAEA",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
