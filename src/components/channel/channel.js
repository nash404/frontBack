import "./channel.css";
import { useSelector, useDispatch } from "react-redux";
import { setDatabase } from "../../reducers/datebase";
import Errors from "../errors/errors";
import Modal from "react-modal";
import { colour } from "../../reducers/colours";
import Menu from "../menu/menu";
import { useSearchParams } from "react-router-dom";
import React, { useEffect } from "react";
import { motion, usePresence, AnimatePresence } from "framer-motion";
import { setErrors } from "../../reducers/errors";
import { Link } from "react-router-dom";
import { useState } from "react";
const getData = (name) => {
  return async (dispatch) => {
    try {
      let result = await fetch(
        `https://blognode-heroku.herokuapp.com/api/channel?name=${name}`,
        (err) => {
          throw err;
        }
      );
      let db = await result.json();
      await dispatch(setDatabase(db));
    } catch (err) {
      console.log(err);
    }
  };
};
function Channel() {
  const [searchParams] = useSearchParams();
  const [buttonSub, setButtonSub] = useState(["Subscribe", "#0094FF", 0]);
  const data = useSelector((state) => state.toolsDatabase.data);
  const dispatch = useDispatch();

  const subOrNot = async (id) => {
    let response = await fetch(
      "https://blognode-heroku.herokuapp.com/api/post/subOrNot/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          data: { token: localStorage.getItem("token"), id: id },
        }),
      }
    );
    let result = await response.json();
    dispatch(setErrors(result.errors));

    setButtonSub([result.text, result.color, result.count]);
  };
  const saveArticle = async (data) => {
    let response = await fetch(
      "https://blognode-heroku.herokuapp.com/api/post/setSavedArticle/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          data: { id: data.id, token: localStorage.getItem("token") },
        }),
      }
    );
    let result = await response.json();
    dispatch(setErrors(result));
  };
  useEffect(() => {
    dispatch(colour(["#b6b6b6", "#b6b6b6", "#b6b6b6"]));
    const checkSub = async () => {
      try {
        let result = await fetch(
          `https://blognode-heroku.herokuapp.com/api/channelSub?name=${searchParams.get(
            "name"
          )}&token=${localStorage.getItem("token")}`,
          (err) => {
            throw err;
          }
        );
        let db = await result.json();
        setButtonSub([db.text, db.color, db.count]);
      } catch (err) {
        console.log(err);
      }
    };
    checkSub();
    dispatch(getData(searchParams.get("name")));
  }, [dispatch, searchParams]);

  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }
  const somethingRefss = React.useRef();

  function closeModal() {
    dispatch(setErrors([{ type: "Success", text: "User is reported" }]));
    somethingRefss.current.value = "";
  }

  return (
    <div>
      <Menu />
      <Errors />
      <br />
      {data[0] === undefined ? (
        <p>Has no channel</p>
      ) : (
        <div>
          {" "}
          <div className="channelInfo">
            <div>
              <img src={data[0].linkOfAva} alt="" />
            </div>
            <div className="secondPartOfInfoChannel">
              <div className="nameAndSubs">
                <div>
                  <p className="nameOfChannel">{data[0].nameOfAuthor}</p>
                </div>
                <div>
                  <p className="counfOfChannel">subscribers {buttonSub[2]}</p>
                </div>
              </div>

              <div className="descOfChannel">
                This is a brief summary, revealing all its main advantages,
                general theme and benefits that ...
              </div>
            </div>
          </div>
          <div className="buttonsSubs">
            <button
              className="buttonSubToChannel"
              style={{ background: buttonSub[1] }}
              onClick={() => subOrNot(data[0].idOfAuthor)}
            >
              {buttonSub[0]}
            </button>
            <button className="complainToChannel" onClick={openModal}>
              Complain
            </button>
          </div>
        </div>
      )}

      <br></br>
      <AnimatePresence>
        {data.map((item, index) => {
          return (
            <ListItem key={index}>
              <div className="main" key={index}>
                <div
                  className="imgOfArticle"
                  style={{
                    backgroundImage: `url(${item.linkOfImg})`,
                  }}
                ></div>
                <div className="buttons">
                  <div className="infoAboutArticle">
                    <div className="nameAndTime">
                      <div className="nameAndAva">
                        <img src={item.linkOfAva} width="35px" alt="" />
                        <p>{item.nameOfAuthor}</p>
                      </div>
                      <div className="timeOfArticle">
                        <p>{item.date}</p>
                      </div>
                    </div>
                    <div>
                      <div className="titleOfArticle">
                        <Link
                          to={`/article?id=${item._id}`}
                          className="withoutStyles"
                        >
                          <p>{item.title}</p>
                        </Link>
                      </div>
                      <div className="descriptionOfArticle">
                        <p>{item.discription}</p>
                      </div>
                    </div>
                  </div>
                  <div className="likeAndComments">
                    <Link
                      to={`/article?id=${item._id}&state=comment`}
                      className="withoutStyles"
                    >
                      <p className="commentOfArticle" style={{ margin: 0 }}>
                        Comment
                      </p>
                    </Link>
                    <p
                      className="commentOfArticle saveArticle"
                      onClick={() => saveArticle({ id: item._id })}
                    >
                      Save
                    </p>
                  </div>
                </div>
              </div>
            </ListItem>
          );
        })}
      </AnimatePresence>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <p style={{ marginLeft: "24px" }} className="setLinkTitle">
          Complain
        </p>

        <div className="elementOfModal">
          <div className="areaPro">
            <textarea
              placeholder="Input new description"
              ref={somethingRefss}
              cols="20"
            ></textarea>
          </div>
          <button
            onClick={closeModal}
            style={{ cursor: "pointer" }}
            className="closeModalImg"
          >
            Report
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Channel;

const transition = { type: "spring", stiffness: 500, damping: 50, mass: 1 };
function ListItem({ children, onClick }) {
  const [isPresent, safeToRemove] = usePresence();

  const animations = {
    layout: true,
    initial: "out",

    animate: isPresent ? "in" : "out",

    variants: {
      in: { scaleY: 1, opacity: 1 },
      out: { scaleY: 0, opacity: 0, zIndex: -1 },
    },
    onAnimationComplete: () => !isPresent && safeToRemove(),
    transition,
  };

  return (
    <motion.div {...animations} onClick={onClick}>
      {children}
    </motion.div>
  );
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    borderRadius: "20px",
    border: "1px solid #EAEAEA",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
