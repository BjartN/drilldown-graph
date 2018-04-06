import { Box } from "./box";
import { Connector } from "./connector";
import { LiteEvent } from "../util/lite-event";
import Raphael from "webpack-raphael";

/**
 * A 2d surface to draw boxes and connectors. This class can be replaced if you want to use something else for rendering.
 *
 * @param  {HTMLCanvas} canvas - Canvas DOM element to draw on
 */
export class Surface {
  constructor(canvas) {
    this.width = canvas.offsetWidth;
    this.height = canvas.offsetHeight;
    this.paper = Raphael(canvas, this.width, this.height);
  }

  createBox(id, isNested) {
    return new Box(id, this.paper, isNested);
  }

  createConnector(from, to) {
    return new Connector(this.paper, from, to);
  }

  clear() {
    this.paper.clear();
  }
}
