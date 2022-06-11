import "./App.css";

import Main from "./components/main/main";
import Channel from "./components/channel/channel";
import SignUp from "./components/signUp/signUp";
import SignIn from "./components/signIn/signIn";
import Saved from "./components/saved/saved";
import Editor from "./components/editor/editor";
import Article from "./components/article/article";
import Subs from "./components/subs/subs";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/article" element={<Article />} />
          <Route path="/channel" element={<Channel />} />
          <Route path="/subs" element={<Subs />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
