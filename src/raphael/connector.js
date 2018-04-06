import { Box } from "./box";
import { LiteEvent } from "../util/lite-event";
import Raphael from "webpack-raphael";

/**
 * Drawing the connection bewteen two boxes using Raphael
 */
export class Connector {
  /**
   * @param  {Paper} paper - The paper to draw the connector
   * @param  {Box} from - Start of connector
   * @param  {Box} to - End of connector
   */
  constructor(paper, from, to) {
    if (paper === undefined || from === undefined || to === undefined) {
      throw new Error("Argument exceptions");
    }

    this.from = from;
    this.to = to;
    this.line = undefined;
    this.paper = paper;

    this.from.moveEvent.on(this.render.bind(this));
    this.to.moveEvent.on(this.render.bind(this));
  }

  /**
   * Draw line between the two boxes
   */
  render() {
    let from = this.from.bbox();
    let to = this.to.bbox();

    var path = [["M", from.cx, from.cy], ["L", to.cx, to.cy]];

    if (this.line === undefined) {
      this.line = this.paper.path(path);
      this.line.attr("stroke-width", 2);
      this.line.attr("stroke", "black");
      this.line.attr("stroke-dasharray", "-");
      this.line.toBack();
    } else {
      this.line.attr("path", path);
    }
  }
}
