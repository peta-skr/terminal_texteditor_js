class Row {
  constructor(string) {
    this.string = string;
  }

  render(start, end) {
    let e = Math.min(end, this.string.length);
    let s = Math.min(start, e);
    return this.string.substring(start, end);
  }
}

exports.Row = Row;
