const { Row } = require("./row");

class Document {
  constructor() {
    this.rows = [];
  }

  open() {
    let rows = [];
    rows.push(new Row("Hello, World!"));
    return rows;
  }

  row(index) {
    return this.rows[index];
  }

  is_empty() {
    return this.rows.is_empty();
  }
}

exports.Document = Document;
