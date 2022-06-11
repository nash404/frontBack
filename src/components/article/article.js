import "./article.css";
import Menu from "../menu/menu";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { setArticle } from "../../reducers/article";
import { motion, usePresence, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { setErrors } from "../../reducers/errors";
import { Link } from "react-router-dom";
import Errors from "../errors/errors";
import { colour } from "../../reducers/colours";
const getData = (id) => {
  return async (dispatch) => {
    let result = await fetch(
      `https://blognode-heroku.herokuapp.com/api/article?id=${id}`
    );
    let data = await result.json();
    await dispatch(setArticle([data.art]));
  };
};

function Article() {
  const ref = useRef(null);
  const data = useSelector((state) => state.setArticle.data);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [comments, setComments] = useState([]);
  const sendDataAboutUser = async () => {
    let response = await fetch(
      "https://blognode-heroku.herokuapp.com/api/post/comments/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          data: {
            idOfArticle: data[0]._id,
            token: localStorage.getItem("token"),
            text: ref.current.value,
          },
        }),
      }
    );
    let result = await response.json();
    if (result.status) {
      setComments(result.comments.reverse());
      return;
    }
    dispatch(setErrors([result.err]));
  };

  useEffect(() => {
    dispatch(colour(["#b6b6b6", "#b6b6b6", "#b6b6b6"]));
    dispatch(getData(searchParams.get("id")));
    const getComm = async (id, state) => {
      let result = await fetch(
        `https://blognode-heroku.herokuapp.com/api/comments?id=${id}`
      );
      let data = await result.json();

      setComments(data.reverse());
      setTimeout(() => {
        if (state === "comment") {
          console.log(refComm.current.offsetTop);
          window.scrollBy(0, refComm.current.offsetTop + 800);
        }
      }, 0);
    };
    getComm(searchParams.get("id"), searchParams.get("state"));
  }, [dispatch, searchParams]);
  const refComm = useRef(null);
  return (
    <div>
      <Menu />
      <Errors />
      <br />
      <div className="articleElements">
        <AnimatePresence>
          {data.map((item, index) => {
            return (
              <ListItem key={index}>
                <div key={index}>
                  <div className="articleUserAva">
                    <img src={item.linkOfAva} width="30px" alt="" />
                    <p>{item.nameOfAuthor}</p>
                    <span>{item.date}</span>
                  </div>
                  <p className="titleOfOneArticle">{item.title}</p>
                  <div
                    className="stylesForArticle"
                    dangerouslySetInnerHTML={{ __html: item.filling }}
                  ></div>
                </div>
              </ListItem>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="commentsArticle" ref={refComm}>
        <p>Comments</p>
      </div>
      <br />
      <div className="fieldComment">
        <input placeholder="Input your comment" ref={ref} />
        <button onClick={sendDataAboutUser}>Send comment</button>
      </div>
      <br></br>
      <div>
        {comments.map((item, index) => {
          return (
            <div className="savedArticle" key={index}>
              <div className="nameAndTime">
                <Link
                  to={`/channel?name=${item.name}`}
                  style={{ textDecoration: "none", color: "#000" }}
                >
                  <div className="nameAndAva">
                    <img src={item.linkAva} width="35px" alt="" />
                    <p>{item.name}</p>
                  </div>
                </Link>
                <div className="timeOfArticle">
                  <p>{item.date}</p>
                </div>
              </div>

              <div className="descOfSavedArticle">
                <p>{item.text}</p>
              </div>
            </div>
          );
        })}
        ;
      </div>
    </div>
  );
}

export default Article;

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
