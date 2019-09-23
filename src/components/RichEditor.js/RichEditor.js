import React from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw
} from "draft-js";
import "@reshuffle/code-transform/macro";

import { BlockStyleControls } from "../BlockStyleControls/BlockStyleControls";
import { InlineStyleControls } from "../InlineStyleControls/InlineStyleControls";

import { addDocToBackend, getDocs, removeDoc } from "../../../backend/diary";
import AllDocs from "../AllDocs/AllDocs";

export default class RichEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      id: "",
      docName: "",
      error: "",
      docs: [],
      updatePage: false
    };

    this.focus = () => this.refs.editor.focus();
    this.onChange = editorState => this.setState({ editorState });

    this.handleKeyCommand = command => this._handleKeyCommand(command);
    this.onTab = e => this._onTab(e);
    this.toggleBlockType = type => this._toggleBlockType(type);
    this.toggleInlineStyle = style => this._toggleInlineStyle(style);
  }

  componentDidMount = () => {
    getDocs().then(docs => {
      this.setState({ docs: docs });
    });
  };

  componentDidUpdate = () => {
    getDocs().then(docs => {
      this.setState({ docs: docs });
    });
  };

  _handleKeyCommand(command) {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _onTab(e) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }

  _toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    );
  }

  newDocument = () => {
    this.setState({
      editorState: EditorState.createEmpty(),
      id: "",
      docName: "",
      error: "",
      updatePage: false
    });
  };

  handleSave = () => {
    if (this.state.docName === "") {
      this.setState({ error: "Please Add a document name" });
    } else {
      const doc = {
        id: this.state.id === "" ? new Date() : this.state.id,
        name: this.state.docName,
        content: convertToRaw(this.state.editorState.getCurrentContent())
      };
      addDocToBackend(doc).then(() =>
        this.setState(
          {
            updatePage: true
          },
          () => setTimeout(() => this.setState({ updatePage: false }), 2000)
        )
      );
    }
  };

  openDoc = (e, index) => {
    this.setState({
      editorState: EditorState.createWithContent(
        convertFromRaw(this.state.docs[index].content)
      ),
      docName: this.state.docs[index].name,
      id: this.state.docs[index].id
    });
  };

  delDoc = (e, id) => {
    removeDoc(id).then(res => {
      console.log(res);
    });
  };

  render() {
    const { editorState } = this.state;

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = "RichEditor-editor";
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (
        contentState
          .getBlockMap()
          .first()
          .getType() !== "unstyled"
      ) {
        className += " RichEditor-hidePlaceholder";
      }
    }

    return (
      <React.Fragment>
        {this.state.updatePage && (
          <div className="alert alert-success" role="alert">
            Document is saved Successfully!
          </div>
        )}
        <div className="row">
          <div className="col-md-7">
            <div className="RichEditor-root">
              <BlockStyleControls
                editorState={editorState}
                onToggle={this.toggleBlockType}
              />
              <InlineStyleControls
                editorState={editorState}
                onToggle={this.toggleInlineStyle}
              />
              <div className={className} onClick={this.focus}>
                <Editor
                  blockStyleFn={getBlockStyle}
                  customStyleMap={styleMap}
                  editorState={editorState}
                  handleKeyCommand={this.handleKeyCommand}
                  onChange={this.onChange}
                  onTab={this.onTab}
                  placeholder="Tell a story..."
                  ref="editor"
                  spellCheck={true}
                  style={{ height: "1000px" }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "2%"
              }}
            >
              <input
                className="form-control ml-2"
                style={{ width: "82%" }}
                value={this.state.docName}
                onChange={e =>
                  this.setState({ docName: e.target.value, error: "" })
                }
              />
              <button
                className="btn btn-outline-success ml-2"
                onClick={this.handleSave}
              >
                Save
              </button>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1%"
              }}
            >
              {this.state.error !== "" && this.state.doc !== "" && (
                <p style={{ color: "red", fontSize: "20px" }}>
                  {this.state.error}
                </p>
              )}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1%"
              }}
            >
              <button
                className="btn btn-outline-primary"
                onClick={this.newDocument}
              >
                New Document
              </button>
            </div>
          </div>
          <AllDocs
            docs={this.state.docs}
            id={this.state.id}
            openDoc={this.openDoc}
            deleteDoc={this.delDoc}
          />
        </div>
      </React.Fragment>
    );
  }
}

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2
  }
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case "blockquote":
      return "RichEditor-blockquote";
    default:
      return null;
  }
}
