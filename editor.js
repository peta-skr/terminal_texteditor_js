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
    this.should_quit = false;
    this.terminal = new Terminal();
    // this.cursor_position = new Position(0, 0);
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
    });
  }

  refresh_screen() {
    this.terminal.clear_screen();
    this.terminal.cursor_position(0, 0);

    if (this.should_quit) {
      console.log("Goodbye.\r");
      process.exit(0);
    } else {
      this.draw_rows();
      this.terminal.cursor_position(0, 0);
    }
    this.terminal.flush();
  }

  process_keypress(key) {
    if (key.sequence == "\x03") {
      //ctrl + c
      this.should_quit = true;
      this.refresh_screen();
    } else {
      console.log(key.sequence);
    }
  }

  //   move_cursor(key) {
  //     let x = this.cursor_position.x;
  //     let y = this.cursor_position.y;
  //     let size = this.terminal.size();
  //     let height = size.height - 1;
  //     let width = size.width - 1;

  //     switch (key.sequence) {
  //       case "up":
  //         if (y > 0) {
  //           y = y - 1;
  //         }
  //         break;
  //       case "down":
  //         if (y < height) {
  //           y += 1;
  //         }
  //         break;
  //       case "left":
  //         if (y > 0) {
  //           x = x - 1;
  //         }
  //         break;
  //       case "right":
  //         if (x < width) {
  //           x += 1;
  //         }
  //         break;
  //       default:
  //         break;
  //     }
  //     this.cursor_position = new Position(x, y);
  //   }

  //   draw_welcome_message() {
  //     let welcome_message = `Hecto editor -- version ${VERSION}`;
  //     let width = this.terminal.size().width;
  //     let len = welcome_message.length;
  //     let padding = (width - len) / 2;
  //     let spaces = " ".repeat(padding - 1);
  //     welcome_message = "~" + spaces + welcome_message;
  //     welcome_message = welcome_message.substring(width);
  //     console.log(welcome_message);
  //   }

  draw_rows() {
    for (let i = 0; i < 24; i++) {
      console.log("~\r");
    }
  }
}

function die(e) {
  console.error(e);
  process.exit(-1);
}

exports.Editor = Editor;
