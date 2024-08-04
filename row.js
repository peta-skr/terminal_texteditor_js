class Row {
  constructor(string) {
    this.string = string;
  }

  render(start, end) {
    let e = Math.min(end, this.string.length);
    let s = Math.min(start, e);
    return this.string.substring(s, e);
  }

  len() {
    return this.string.length
  }

  is_empty() {
    
  }
}

exports.Row = Row;
