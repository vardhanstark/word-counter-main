import React, { Component } from "react";
import { render } from "react-dom";
import { compose } from "ramda";
import "./index.css";

class App extends Component {
  state = {
    text: "",
    charCount: 0,
    wordCount: 0,
  };

  componentDidMount() {
    this.getBacon()
      .then((bacon) => {
        this.setState({ text: bacon.join("\n\n") }, () =>
          this.setCounts(this.state.text)
        );
      })
      .catch((err) => this.setState({ text: `Error: ${err.message}` }));
  }

  getBacon = async () => {
    const response = await fetch(
      "https://baconipsum.com/api/?type=all-meat&paras=0"
    );
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
      
    return body;
  };

  removeBreaks = (arr) => {
    const index = arr.findIndex((el) => el.match(/\r?\n|\r/g));

    if (index === -1) return arr;

    const newArray = [
      ...arr.slice(0, index),
      ...arr[index].split(/\r?\n|\r/),
      ...arr.slice(index + 1, arr.length),
    ];

    return this.removeBreaks(newArray);
  };

  removeEmptyElements = (arr) => {
    const index = arr.findIndex((el) => el.trim() === "");

    if (index === -1) return arr;

    arr.splice(index, 1);

    return this.removeEmptyElements(arr);
  };

  setCounts = (value) => {
    const trimmedValue = value.trim();
    const words = compose(
      this.removeEmptyElements,
      this.removeBreaks
    )(trimmedValue.split(" "));
    const sentences = compose(
      this.removeEmptyElements,
      this.removeBreaks
    )(trimmedValue.split("."));
    const paragraphs = this.removeEmptyElements(trimmedValue.split(/\r?\n|\r/));

    this.setState({
      text: value,
      charCount: trimmedValue.length,
      wordCount: value === "" ? 0 : words.length,
      sentenceCount: value === "" ? 0 : sentences.length,
      paragraphCount: value === "" ? 0 : paragraphs.length,
    });
  };

  handleChange = (e) => this.setCounts(e.target.value);

  render() {
    return (
      <div className="main">
        <h1>Responsive Paragraph word counter</h1>
        <textarea
          rows="15"
          onChange={this.handleChange}
          value={this.state.text}
        ></textarea>
        <p>
          <strong>Word Count:</strong> {this.state.wordCount}
        </p>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
