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

  getSize() {
    return this.size;
  }

  clear_screen() {
    console.clear();
  }

  cursor_position(position) {
    readline.cursorTo(process.stdout, position.x, position.y);
  }

  flush() {}

  cursor_hide() {
    process.stdout.write("\x1b[?25l");
  }

  cursor_show() {
    // カーソルを表示する
    process.stdout.write("\x1b[?25h");
  }

  clear_current_line() {
    readline.clearLine(process.stdout);
  }
}

exports.Terminal = Terminal;
