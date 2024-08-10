const { workerData } = require("worker_threads");
const { Document } = require("./document");
const { Terminal } = require("./terminal");
const readline = require("readline");

const VERSION = process.versions.node;

class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Editor {
  constructor() {

    let args = process.argv;
    let document;
    if (args.length > 2) {
      let file_name = args[2];
      console.log(file_name);
      
      document = new Document().open(file_name);
    }else {
      document = new Document();
    }

    this.should_quit = false;
    this.terminal = new Terminal();
    this.cursor_position = new Position(0, 0);
    this.offset = new Position(0, 0);
    this.document = document;
  }

  run() {
    readline.emitKeypressEvents(process.stdin);
    // process.stdin.setRawMode(true);

    this.refresh_screen();

    process.stdin.on("keypress", (str, key) => {
      this.refresh_screen();

      // if (this.should_quit) {
      //   process.exit(0);
      // }
      this.process_keypress(key);
      this.change_screen();
    });
  }

  refresh_screen() {
    this.terminal.cursor_hide();
    this.terminal.cursor_position(new Position(0, 0));

    if (this.should_quit) {
      this.terminal.clear_screen();
      console.log("Goodbye.\r");
      process.exit(0);
    } else {
      this.draw_rows();
      this.terminal.cursor_position(this.cursor_position);
    }
    this.terminal.cursor_show();
    this.terminal.flush();
  }

  change_screen() {
    this.terminal.cursor_hide();
    this.terminal.cursor_position(new Position(0, 0));

    if (this.should_quit) {
      this.terminal.clear_screen();
      console.log("Goodbye.\r");
      process.exit(0);
    } else {
      this.terminal.cursor_position(new Position(this.cursor_position.x - this.offset.x, this.cursor_position.y - this.offset.y));
    }
    this.terminal.cursor_show();
  }

  process_keypress(key) {
    if (key.sequence == "\x03") {
      //ctrl + c
      this.should_quit = true;
      this.refresh_screen();
    } else if (
      [
        "up",
        "left",
        "right",
        "down",
        "home",
        "end",
        "pageup",
        "pagedown",
      ].includes(key.name)
    ) {
      this.move_cursor(key);
    } else {
      console.log(key);
    }
    this.scroll();
  }

  scroll() {
    let position = this.cursor_position;
    let width = this.terminal.getSize().width;
    let height = this.terminal.getSize().height;
    let offset = this.offset;

    if (position.y < offset.y) {
      offset.y = position.y;
    }else if (position.y >= offset.y + height) {
      offset.y = position.y - height + 1;
    }

    if (position.x < offset.x) {
      offset.x = position.x;
    }else if (position.x >= offset.x + width) {
      offset.x = position.x - width + 1;
    }
  }

  move_cursor(key) {
    let terminal_height = this.terminal.getSize().height;
    let x = this.cursor_position.x;
    let y = this.cursor_position.y;
    let height = this.document.len();
    let width = this.document.row(y) ? this.document.row(y).len() : 0;


    switch (key.name) {
      case "up":
        y = y > 0 ? y - 1 : 0;
        break;
      case "down":
        if (y < height) {
          y += 1;
        }
        break;
      case "left":
       if (x > 0) {
          x -= 1;
       }else if (y > 0) {
        y -= 1;
        if (this.document.row(y)) {
          x = this.document.row(y).len();
        }else {
          x = 0;
        }
       }
        break;
      case "right":
        if (x < width) {
          x += 1;
        }else if (y < height) {
          y += 1;
          x = 0;
        }
        break;
      case "pageup":
        y = y > terminal_height ? y - terminal_height : 0;
        break;
      case "pagedown":
        y = y + terminal_height < height ? y + terminal_height : height;
        break;
      case "home":
        x = 0;
        break;
      case "end":
        x = width;
        break;
    }

    width = this.document.row(y) ? this.document.row(y).len() : 0;
    if (x > width) {
      x = width;
    }

    this.cursor_position.x = x;
    this.cursor_position.y = y;
  }

  draw_welcome_message() {
    let welcome_message = `Hecto editor -- version ${VERSION}`;
    let width = this.terminal.getSize().width;
    let len = welcome_message.length;
    let padding = width - len > -1 ? (width - len) / 2 : 0;
    let spaces = " ".repeat(padding > 0 ? padding - 1 : 0);
    welcome_message = "~" + spaces + welcome_message;
    welcome_message = welcome_message.substring(0, width);
    console.log(`${welcome_message}\r`);
  }

  draw_row(row) {
    let width = this.terminal.getSize().width;
    let start = this.offset.x;
    let end = this.offset.x + width;
    let row_render = row.render(start, end);
    console.log(`${row_render}\r`);
  }

  draw_rows() {
    let height = this.terminal.getSize().height;
    for (let i = 0; i < height - 1; i++) {
      this.terminal.clear_current_line();
      let row = this.document.row(i + this.offset.y);
      if (row) {
        this.draw_row(row);
      }else if (this.document.is_empty() && i == Math.floor(height / 3)) {
        this.draw_welcome_message();
      } else {
        console.log("~\r");
      }
    }
  }
}

function die(e) {
  console.error(e);
  process.exit(-1);
}

exports.Editor = Editor;
exports.Position = Position;
