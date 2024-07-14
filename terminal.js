const readline = require("readline");

class Size {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
}

class Terminal {
  constructor() {
    let size = new Size(process.stdout.columns, process.stdout.rows);

    this.size = size;
    this._stdout = process.stdin.setRawMode(true);
  }

  size() {
    return this.size;
  }

  clear_screen() {
    console.clear();
  }

  cursor_position(x, y) {
    readline.cursorTo(process.stdout, x, y);
  }

  flush() {}

  // cursor_hide() {}

  // cursor_show() {}

  // clear_current_line() {
  //   readline.clearLine(process.stdout);
  // }
}

exports.Terminal = Terminal;
