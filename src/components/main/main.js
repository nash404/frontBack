import "./main.css";
import { useSelector, useDispatch } from "react-redux";
import { setDatabase } from "../../reducers/datebase";
import Errors from "../errors/errors";
import { colour } from "../../reducers/colours";
import Menu from "../menu/menu";
import React, { useEffect } from "react";
import { motion, usePresence, AnimatePresence } from "framer-motion";
import { setErrors } from "../../reducers/errors";
import { Link } from "react-router-dom";
const getData = () => {
  return async (dispatch) => {
    try {
      let result = await fetch(
        "https://blognode-heroku.herokuapp.com/api/content",
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

function Main() {
  const data = useSelector((state) => state.toolsDatabase.data);
  const dispatch = useDispatch();

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
    dispatch(colour(["#000", "#b6b6b6", "#b6b6b6"]));
    dispatch(getData());
  }, [dispatch]);
  return (
    <div>
      <Errors />
      <Menu />
      <br />

      <div className="mainBlock">
        <div className="title">
          <p>Your tape</p>
        </div>
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
                        <Link
                          to={`/channel?name=${item.nameOfAuthor}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            textDecoration: "none",
                            color: "#000",
                          }}
                        >
                          <div className="nameAndAva">
                            <img src={item.linkOfAva} width="35px" alt="" />
                            <p>{item.nameOfAuthor}</p>
                          </div>
                          <div className="timeOfArticle">
                            <p>{item.date}</p>
                          </div>
                        </Link>
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
      </div>
    </div>
  );
}

export default Main;

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
