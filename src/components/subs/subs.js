import "./subs.css";
import Menu from "../menu/menu";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { motion, usePresence, AnimatePresence } from "framer-motion";
import { colour } from "../../reducers/colours";
import Errors from "../errors/errors";
import { Link } from "react-router-dom";
function Subs() {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  useEffect(() => {
    dispatch(colour(["#b6b6b6", "#000", "#b6b6b6"]));
    const getData = async (token) => {
      try {
        let result = await fetch(
          `https://blognode-heroku.herokuapp.com/api/getSub?token=${localStorage.getItem(
            "token"
          )}`,
          (err) => {
            throw err;
          }
        );
        let db = await result.json();
        await setData(db);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, [dispatch]);
  return (
    <div>
      <Errors />
      <Menu />
      <br />
      <div className="titleSubs">
        <p>Your subscriptions</p>
      </div>
      <div className="subsPlace">
        <AnimatePresence>
          {data.map((item, index) => {
            return (
              <Link
                key={index}
                to={`/channel?name=${item.name}`}
                style={{ textDecoration: "none", color: "#000" }}
              >
                <ListItem>
                  <div className="sub">
                    <div>
                      <img src={item.img} alt="" />
                    </div>
                    <div className="nameSub">
                      <div className="subName">
                        <p>{item.name}</p>
                      </div>
                      <div className="subCount">
                        <p>subscribers {item.count}</p>
                      </div>
                    </div>
                  </div>
                </ListItem>
              </Link>
            );
          })}
        </AnimatePresence>
        {data.length === 0 ? (
          <div className="dontLogIn">
            <p>You have no subscriptions</p>
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}

export default Subs;

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
