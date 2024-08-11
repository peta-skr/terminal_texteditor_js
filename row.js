const split = require("graphemesplit")

class Row {
  constructor(string) {
    this.string = string;
    this.length = split(string).length;
  }

  render(start, end) {
    let e = Math.min(end, split(this.string).length);
    let s = Math.min(start, e);

    let result = split(this.string).slice(s, e).join("").replace("\t", " ");

    return result;
  }

  len() {
    return this.length;
  }

  is_empty() {
    return this.length == 0;
  }

}

exports.Row = Row;
