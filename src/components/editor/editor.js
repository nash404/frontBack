import "./editor.css";
import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import { setErrors } from "../../reducers/errors";
import { useDispatch } from "react-redux";
import Errors from "../errors/errors";
import $ from "jquery";
function Editor() {
  const dispatch = useDispatch();
  const title = useRef(0);

  const CheckUser = async () => {
    let response = await fetch(
      "https://blognode-heroku.herokuapp.com/api/post/editorCheck/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ token: localStorage.getItem("token") }),
      }
    );
    let result = await response.json();

    return !result.status;
  };
  useEffect(() => {
    let isAuth = CheckUser();
    isAuth.then((value) => {
      if (value) window.location.assign("/");
    });
  }, []);

  const getHtml = async () => {
    let copied = [...data];

    copied.forEach((item, indexItem) => {
      copied[indexItem].html = refsOfField.current[indexItem].innerHTML;
    });
    let html = "";
    let desc = "";
    copied.forEach((item, index) => {
      if (copied.length !== index + 1) {
        let fLine = item.html.replaceAll("<div>", "");
        let sLine = fLine.replaceAll("</div>", "");
        let rLine = sLine.replaceAll("<br>", "");
        let resultStr = "<p>" + rLine + "</p>";
        if (rLine.length === 0) {
          html += "<br>";
          return;
        }
        html += resultStr;
      }
    });

    refHelpEditorElem.current.innerHTML = html;
    desc = refHelpEditorElem.current.textContent.substring(0, 230);
    return { html: html, desc: desc };
  };

  const publicArticle = async () => {
    let res = await getHtml();

    let data = {
      token: localStorage.getItem("token"),
      title: title.current.value,
      html: res.html,
      discription: res.desc + "...",
    };

    let response = await fetch(
      "https://blognode-heroku.herokuapp.com/api/post/article/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ data: data }),
      }
    );
    let result = await response.json();
    await dispatch(setErrors(result));
  };

  window.addEventListener("keyup", (event) => {
    if (document.activeElement.isContentEditable) {
      if (
        event.key === "ArrowDown" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === "Backspace" ||
        event.key === "Enter"
      )
        $(`.tools`).animate(
          {
            opacity: 0,
            scale: 0.25,
            width: "0px",
            padding: "0",
          },
          200
        );
    }
  });

  const [data, setDate] = useState([
    { type: "block", html: "Input your article", class: "regularField" },

    { type: "help", html: "", class: "hiddenField" },
  ]);
  const refsOfField = useRef([]);
  refsOfField.current = [];
  let selectedItem = [];

  const refAdd = useRef(null);

  let checkState = 0;
  window.onclick = (event) => {
    if (
      event.target !==
        refsOfField.current[Number(localStorage.getItem("line"))] &&
      event.target !== refAdd.current
    ) {
      refAdd.current.style.display = "none";
    }
    if (checkState === 0 && selectedItem.length !== 0) {
      checkState = 1;
      return;
    }
    const boxes = document.querySelectorAll(".selectionBlock");

    boxes.forEach((box) => {
      box.style.backgroundColor = "#fff";
    });
    selectedItem = [];
    firstElem = 0;
    checkState = 0;
  };
  const arrayMin = (arr) => {
    return arr.reduce(function (p, v) {
      return p < v ? p : v;
    });
  };
  const setField = async (event, index) => {
    if (event.key === "Enter") {
      if (index > 0 && index < data.length - 1) {
        let copied = [...data];

        copied[index].html = refsOfField.current[index].innerHTML;
        copied.forEach((item, indexItem) => {
          copied[indexItem].html = refsOfField.current[indexItem].innerHTML;
        });
        copied.splice(index + 1, 0, {
          type: "paragraph",
          html: "",
          class: "regularField",
        });
        setDate(copied);

        let elem = refsOfField.current[index + 1];
        elem.focus();

        localStorage.setItem("line", index + 1);

        setTimeout(() => {
          refAdd.current.style.top = `${elem.offsetTop}px`;
          refAdd.current.style.left = `${elem.offsetLeft - 40}px`;
          refAdd.current.style.display = "block";
        }, 0);
        return;
      }

      if (index === 0) {
        let copied = [...data];
        copied.forEach((item, indexItem) => {
          copied[indexItem].html = refsOfField.current[indexItem].innerHTML;
        });
        copied[index].html = refsOfField.current[index].innerHTML;
        copied.splice(index + 1, 0, {
          type: "paragraph",
          html: "",
          class: "regularField",
        });
        setDate(copied);

        let elem = refsOfField.current[index + 1];
        elem.focus();

        localStorage.setItem("line", index + 1);

        setTimeout(() => {
          refAdd.current.style.top = `${elem.offsetTop}px`;
          refAdd.current.style.left = `${elem.offsetLeft - 40}px`;
          refAdd.current.style.display = "block";
        }, 0);

        return;
      }
    }
    if (event.key === "ArrowUp") {
      if (index !== 0) {
        let copied = [...data];
        copied[index].html = refsOfField.current[index].innerHTML;
        setDate(copied);

        let elem = refsOfField.current[index - 1];
        elem.focus();
        localStorage.setItem("line", index - 1);

        if (elem.textContent.length === 0) {
          refAdd.current.style.top = `${elem.offsetTop}px`;
          refAdd.current.style.left = `${elem.offsetLeft - 40}px`;
          refAdd.current.style.display = "block";
        } else refAdd.current.style.display = "none";
      }
    }

    if (event.key === "ArrowDown") {
      if (index !== data.length - 2) {
        let copied = [...data];
        copied[index].html = refsOfField.current[index].innerHTML;
        setDate(copied);
        let elem = refsOfField.current[index + 1];
        elem.focus();
        localStorage.setItem("line", index + 1);

        if (elem.textContent.length === 0) {
          refAdd.current.style.top = `${elem.offsetTop}px`;
          refAdd.current.style.left = `${elem.offsetLeft - 40}px`;
          refAdd.current.style.display = "block";
        } else refAdd.current.style.display = "none";
      }
    }

    if (event.key === "Backspace") {
      const length = selectedItem.length;
      if (length !== 0) {
        let copied = [...data];

        copied.forEach((item, indexItem) => {
          copied[indexItem].html = refsOfField.current[indexItem].innerHTML;
        });

        copied[firstElem] = 1;

        for (let indexItem of selectedItem) copied[indexItem] = 1;
        let doneArray = [];
        copied.forEach((item) => {
          if (item !== 1) doneArray.push(item);
        });
        let min = arrayMin(selectedItem);

        setDate(doneArray);

        const boxes = document.querySelectorAll(".selectionBlock");

        boxes.forEach((box) => {
          box.style.backgroundColor = "#fff";
        });

        selectedItem = [];
        firstElem = null;
        refsOfField.current[min].focus();
        refAdd.current.style.display = "none";
        return;
      }
      let some = refsOfField.current[index].textContent;

      if (some.length === 0) {
        if (index === 0) return;

        let copied = [...data];
        copied.splice(index, 1);
        setDate(copied);
        refsOfField.current[index - 1].focus();
        refAdd.current.style.display = "none";
      }
    }
  };
  let stateOfSelection = false;
  let firstElem;
  const refBlock = useRef(null);
  const showTools = (index) => {
    let typeText = window.getSelection().toString();

    if (typeText.length === 0) {
      $(`.tools`).animate(
        {
          opacity: 0,
          scale: 0.25,
          width: "0px",
          padding: "0",
        },
        200
      );
      //refBlock.current.style.display = "none";
      return;
    }
    refBlock.current.style.display = "flex";
    $(`.tools`).animate(
      {
        opacity: 1,

        width: "230px",
        padding: "10px 20px 10px 20px",
      },
      200
    );

    let selectedText = window.getSelection();
    let oRange = selectedText.getRangeAt(0);
    let oRect = oRange.getBoundingClientRect();
    refBlock.current.style.top = `${oRect.y - 40}px`;
    refBlock.current.style.left = `${oRect.x}px`;
  };
  const setSelection = (index) => {
    stateOfSelection = true;
    localStorage.setItem("line", index);
    firstElem = index;
  };
  const removeSelection = (index) => {
    showTools(index);

    stateOfSelection = false;
    let elem = refsOfField.current[index];
    localStorage.setItem("line", index);
    if (elem.textContent.length === 0) {
      refAdd.current.style.top = `${elem.offsetTop}px`;
      refAdd.current.style.left = `${elem.offsetLeft - 40}px`;
      refAdd.current.style.display = "block";
    } else {
      refAdd.current.style.display = "none";
    }
  };

  const showSelection = (index) => {
    if (stateOfSelection) {
      refBlock.current.style.display = "none";
      let stateOfColor = refsOfField.current[index].style.backgroundColor;

      if (stateOfColor === "rgba(32, 160, 245, 0.5)") {
        if (index === firstElem) {
          refsOfField.current[index].style.backgroundColor = "#fff";
          if (index === 0) {
            refsOfField.current[index + 1].style.backgroundColor = "#fff";
            let indexOfElem = selectedItem.indexOf(index + 1);
            if (indexOfElem !== -1) {
              selectedItem.splice(indexOfElem, 1);
            }

            return;
          }
          if (index === data.length - 1) {
            refsOfField.current[index - 1].style.backgroundColor = "#fff";
            let indexOfElem = selectedItem.indexOf(index - 1);
            if (indexOfElem !== -1) {
              selectedItem.splice(indexOfElem, 1);
            }

            return;
          }
          refsOfField.current[index + 1].style.backgroundColor = "#fff";
          refsOfField.current[index - 1].style.backgroundColor = "#fff";
          let indexOfElem = selectedItem.indexOf(index + 1);
          if (indexOfElem !== -1) {
            selectedItem.splice(indexOfElem, 1);
          }

          indexOfElem = selectedItem.indexOf(index - 1);
          if (indexOfElem !== -1) {
            selectedItem.splice(indexOfElem, 1);
          }
        }
        if (index > firstElem) {
          refsOfField.current[index + 1].style.backgroundColor = "#fff";
          let indexOfElem = selectedItem.indexOf(index + 1);
          if (indexOfElem !== -1) {
            selectedItem.splice(indexOfElem, 1);
          }

          return;
        }

        if (index < firstElem) {
          refsOfField.current[index - 1].style.backgroundColor = "#fff";
          let indexOfElem = selectedItem.indexOf(index - 1);
          if (indexOfElem !== -1) {
            selectedItem.splice(indexOfElem, 1);
          }
          return;
        }
      } else {
        if (index !== Number(localStorage.getItem("line"))) {
          window.getSelection().removeAllRanges();
          refsOfField.current[firstElem].style.backgroundColor =
            "rgba(32, 160, 245, 0.5)";
          refsOfField.current[index].style.backgroundColor =
            "rgba(32, 160, 245, 0.5)";
          selectedItem.push(index);
        }
      }
    }
  };

  const addRef = (el) => {
    if (el && !refsOfField.current.includes[el]) {
      refsOfField.current.push(el);
    }
  };
  const hideBlock = (index) => {
    let elem = refsOfField.current[index];

    if (elem.textContent.length === 0) {
      refAdd.current.style.top = `${elem.offsetTop}px`;
      refAdd.current.style.left = `${elem.offsetLeft - 40}px`;
      refAdd.current.style.display = "block";
    } else {
      refAdd.current.style.display = "none";
    }
  };

  const putImageToField = () => {
    openModal();
  };

  const bold = () => {
    document.execCommand("bold");

    stateOfSelection = false;
  };

  const italic = () => {
    document.execCommand("italic", false);

    stateOfSelection = false;
  };
  const underline = () => {
    document.execCommand("underline", false);

    stateOfSelection = false;
  };

  const refEditor = useRef(null);
  const refHelpEditorElem = useRef(null);

  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const addImage = () => {
    let img = `<img src="${refAddImage.current.value}" alt=""/>`;
    let copied = [...data];
    copied[Number(localStorage.getItem("line"))].type = "img";
    copied[Number(localStorage.getItem("line"))].html = img;
    setDate(copied);
    setIsOpen(false);
  };
  const refAddImage = useRef(null);

  return (
    <div>
      <Errors />

      <div className="menuEditor">
        <div className="firstEditor">
          <div className="logoEditor">
            <p>Editor</p>
          </div>
          <div className="userInfoEditor">
            <img src="https://i.imgur.com/aA3RIjc.jpg" width="35px" alt="" />
            <p>Tom Wilson</p>
          </div>
        </div>
        <div className="secondEditor">
          <button onClick={publicArticle}>Publish</button>
        </div>
      </div>

      <div>
        <div ref={refBlock} className="tools" style={{ position: "fixed" }}>
          <div>
            <button onClick={italic}>Italic</button>
          </div>
          <div className="rightEditor">
            <button onClick={bold}>Bold</button>
          </div>
          <div className="rightEditor">
            <button onClick={bold}>Hyperlink</button>
          </div>
          <div className="rightEditor">
            <button onClick={underline}>Underline</button>
          </div>
        </div>
        <div
          className="addImage"
          ref={refAdd}
          onClick={putImageToField}
          style={{
            top: "0",
            left: "0",
            display: "none",
          }}
        >
          Add
        </div>
        <div className="editorPlace">
          <input className="titleField" ref={title} placeholder="Input title" />
        </div>
        <div className="editor" ref={refEditor}>
          {data.map((item, index) => {
            return (
              <div
                contentEditable="true"
                onKeyDown={(event) => setField(event, index)}
                className={`fieldText ${item.class} selectionBlock`}
                key={index}
                ref={addRef}
                onMouseDown={() => setSelection(index)}
                onMouseUp={() => removeSelection(index)}
                onInput={() => hideBlock(index)}
                onMouseOver={() => showSelection(index)}
                dangerouslySetInnerHTML={{ __html: item.html }}
              ></div>
            );
          })}
        </div>
      </div>
      <div
        ref={refHelpEditorElem}
        style={{ position: "fixed", top: "-10000px", left: "-10000px" }}
        contentEditable
      ></div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <p className="setLinkTitle">Set link</p>
        <div className="elementOfModal">
          <div className="setLinkImg">
            <input placeholder="Input link" ref={refAddImage} />
          </div>
          <button onClick={addImage} className="addImageModal">
            Add image
          </button>
          <button onClick={closeModal} className="closeModalImg">
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Editor;

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
