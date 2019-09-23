import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import RichEditor from "./components/RichEditor.js/RichEditor";

class App extends React.Component {
  state = {};

  render() {
    return (
      <div>
        <RichEditor />
      </div>
    );
  }
}

export default App;
