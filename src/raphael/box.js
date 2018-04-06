import { LiteEvent } from "../util/lite-event";
import Raphael from "webpack-raphael";
import "./fitText";

/**
 * Drawing and dragging of a graph node using Raphael
 */
export class Box {
  /**
   * @param  {string} id - Id of the node
   * @param  {Paper} paper - Rafphael Paper object
   * @param  {boolean} isNested - Indicates that this node can be drilled into
   */
  constructor(id, paper, isNested) {
    this.id = id;
    this.width = 120;
    this.height = 80;
    this.box = undefined;
    this.paper = paper;
    this.isNested = isNested;

    this.paddingX = this.width / 2;
    this.paddingY = this.height / 2;

    this.moveEvent = new LiteEvent();
    this.moveEndEvent = new LiteEvent();
    this.clickEvent = new LiteEvent();
  }

  /**
   * Render a box at position given by upper right corner
   * @param  {integer} x - Upper right corner x
   * @param  {integer} y - Upper right corner y
   */
  render(x, y) {
    this.box = this.paper.rect(x, y, this.width, this.height);
    this.box.attr("fill", this.isNested ? "#ccff66" : "#ececec");
    this.box.attr("stroke-width", 2);
    this.box.attr("stroke", "black");

    this.box.drag(
      this.move.bind(this),
      this.start.bind(this),
      this.end.bind(this)
    );
    this.box.dblclick(() => {
      this.clickEvent.trigger();
    });

    let tp = this.textPosition(x, y);
    this.text = this.paper.text(tp.x, tp.y, this.id).fitText(this.width);
    this.text.attr("stroke-width", 0.5);
    this.text.attr("stroke", "black");
  }

  /**
   * Start moving the box
   * @private
   */
  start() {
    this.ox = this.box.attr("x");
    this.oy = this.box.attr("y");
  }

  /**
   * Moving the box
   * @private
   */
  move(dx, dy) {
    let x = this.ox + dx;
    let y = this.oy + dy;
    this.setPosition(x, y);
  }

  /**
   * End moving the box
   * @private
   */
  end() {
    let bbox = this.bbox();
    let x = Box.snap(bbox.x);
    let y = Box.snap(bbox.y);
    this.setPosition(x, y);
    this.moveEndEvent.trigger();
  }

  /**
   * Get position of text
   * @private
   */
  textPosition(x, y) {
    return { x: x + this.paddingX, y: y + this.paddingY };
  }

  /**
   * Set position of text within box
   * @param  {} x Upper left corner of box
   * @param  {} y Lower left corner of box
   */
  setPosition(x, y) {
    this.text.attr(this.textPosition(x, y));
    this.box.attr({ x: x, y: y });
    this.moveEvent.trigger();
  }
  /**
   * Round to nearest grid point
   * @private
   * @param  {number} x - Number
   */
  static snap(x) {
    let gridResolution = 80;
    return Math.round(x / gridResolution) * gridResolution;
  }

  /**
   * Get boundingbox of Box
   */
  bbox() {
    let width = this.box.attr("width");
    let height = this.box.attr("height");
    let x = this.box.attr("x");
    let y = this.box.attr("y");
    let cy = y + height / 2;
    let cx = x + width / 2;

    return {
      width: width,
      height: height,
      x: x,
      y: y,
      cx: cx,
      cy: cy
    };
  }
}
