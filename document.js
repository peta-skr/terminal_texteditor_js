const { Row } = require("./row");

class Document {
  constructor() {
    this.rows = [];
  }

  open() {
    let rows = [];
    rows.push(Row.from("Hello, World!"));
    return rows;
  }
}

exports.Document = Document;
