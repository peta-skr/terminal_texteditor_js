const { Row } = require("./row");
const fs = require("fs");

class Document {
  constructor() {
    this.rows = [];
  }

  open(filename) {
    try {
      let contents = fs.readFileSync(filename, "utf-8").split("\r\n");
      for (let value of contents) {
        this.rows.push(new Row(value));
      }
      return this
    }catch(e) {
      process.exit(1);
    }
  }

  row(index) {
    return this.rows[index];
  }

  is_empty() {
    return this.rows.length == 0;
  }

  len() {
    return this.rows.length;
  }
}

exports.Document = Document;
