import "./saved.css";
import { useDispatch, useSelector } from "react-redux";
import { colour } from "../../reducers/colours";
import Menu from "../menu/menu";
import React, { useEffect } from "react";
import Errors from "../errors/errors";
import { motion, usePresence, AnimatePresence } from "framer-motion";
import { setSaved } from "../../reducers/savedArticle";
import { setErrors } from "../../reducers/errors";
import { Link } from "react-router-dom";
const getData = () => {
  return async (dispatch) => {
    let result = await fetch(
      "https://blognode-heroku.herokuapp.com/api/saved?name=" +
        localStorage.getItem("token")
    );
    let db = await result.json();
    console.log();
    await dispatch(setSaved(db));
  };
};

function Saved() {
  const deleteArticle = async (data) => {
    let get = await fetch(
      "https://blognode-heroku.herokuapp.com/api/post/deleteArticle/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          data: {
            nameOfAuthor: data.name,
            idOfArticle: data.idOfArticle,
            token: localStorage.getItem("token"),
          },
        }),
      }
    );

    let getRes = await get.json();
    dispatch(setErrors(getRes));
    dispatch(getData());
  };
  const data = useSelector((state) => state.getSavedArticle.data);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getData());
    dispatch(colour(["#b6b6b6", "#b6b6b6", "#000"]));
  }, [dispatch]);

  return (
    <div>
      <Errors />
      <Menu />
      <br />
      <div className="mainSaved">
        <div className="titleOfSaved">
          <p>Saved</p>
        </div>
        <AnimatePresence>
          {data.map((item, index) => {
            return (
              <ListItem key={index}>
                <div className="savedArticle" key={index}>
                  <div className="nameAndTime">
                    <div className="nameAndAva">
                      <img src={item.linkOfAva} width="35px" alt="" />
                      <p>{item.nameOfAuthor}</p>
                    </div>
                    <div className="timeOfArticle">
                      <p>{item.date}</p>
                    </div>
                  </div>
                  <Link
                    to={`/article?id=${item._id}`}
                    style={{ textDecoration: "none", color: "#000" }}
                  >
                    <p className="titleOfSavedArticle">{item.title}</p>
                  </Link>
                  <div className="descOfSavedArticle">
                    <p>{item.discription}</p>
                  </div>
                  <div className="daleteSavedArticle">
                    <p
                      onClick={() =>
                        deleteArticle({
                          name: item.nameOfAuthor,
                          idOfArticle: item._id,
                        })
                      }
                    >
                      Delete
                    </p>
                  </div>
                </div>
              </ListItem>
            );
          })}
        </AnimatePresence>
        {data.length === 0 ? (
          <div className="dontLogIn">
            <p>You have no saved articles</p>
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}

export default Saved;

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
