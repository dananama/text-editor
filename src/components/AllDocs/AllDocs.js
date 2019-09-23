import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileWord, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./cursor.css";

class AllDocs extends Component {
  state = {};
  render() {
    return (
      <>
        <div className="col-md-5">
          <div
            className=""
            style={{
              marginTop: "25px",
              marginRight: "25px",
              backgroundColor: "white",
              border: "1px solid #ddd",
              height: "82%"
            }}
          >
            <div
              className="d-flex justify-content-center pt-3 pb-3"
              style={{ borderBottom: "1px solid #ddd" }}
            >
              <h2>Saved Documents</h2>
            </div>
            <div
              className="container mt-2"
              style={{ overflowY: "auto", height: "400px", width: "500px" }}
            >
              {this.props.docs.map((doc, index) => (
                <div
                  className=""
                  style={{
                    fontSize: "15px",
                    fontWeight: this.props.id === doc.id ? "bold" : "",
                    width: "100%",
                    marginBottom: "10px",
                    borderBlock: "1px",
                    borderBottom: "1px solid #ddd"
                  }}
                  key={doc.id}
                  id={index}
                >
                  <span
                    onClick={e => this.props.openDoc(e, index)}
                    style={{ width: "70%" }}
                    className="pointer"
                  >
                    <FontAwesomeIcon icon={faFileWord} color="blue" />{" "}
                    {doc.name}{" "}
                  </span>
                  <FontAwesomeIcon
                    icon={faTrash}
                    color="red"
                    className="pointer"
                    style={{ float: "right" }}
                    onClick={e => this.props.deleteDoc(e, doc.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default AllDocs;
