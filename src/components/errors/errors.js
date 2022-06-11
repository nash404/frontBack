import "./errors.css";
import { useSelector, useDispatch } from "react-redux";
import { deleteError } from "../../reducers/errors";
import { motion, usePresence, AnimatePresence } from "framer-motion";

function Errors() {
  const errs = useSelector((state) => state.errorsSlice.errors);
  const dispatch = useDispatch();
  return (
    <div className="errors">
      <AnimatePresence>
        {errs.map((item, index) => {
          return (
            <ListItem key={index} onClick={() => dispatch(deleteError(index))}>
              <div key={index} className={item.type}>
                <div className="textOfError">
                  <p>{item.text}</p>
                </div>

                <div className="closeError">
                  <p>Close</p>
                </div>
              </div>
            </ListItem>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

const transition = { type: "spring", stiffness: 500, damping: 50, mass: 1 };
function ListItem({ children, onClick }) {
  const [isPresent, safeToRemove] = usePresence();

  const animations = {
    layout: true,
    initial: "out",

    animate: isPresent ? "in" : "out",
    whileTap: "tapped",
    variants: {
      in: { scaleY: 1, opacity: 1 },
      out: { scaleY: 0, opacity: 0, zIndex: -1 },
      tapped: { scale: 0.98, opacity: 0.5, transition: { duration: 0.1 } },
    },
    onAnimationComplete: () => !isPresent && safeToRemove(),
    transition,
  };

  return (
    <motion.h1 {...animations} onClick={onClick}>
      {children}
    </motion.h1>
  );
}

export default Errors;
