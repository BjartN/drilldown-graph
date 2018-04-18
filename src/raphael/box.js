import { LiteEvent } from "../util/lite-event";
import Raphael from "webpack-raphael";
import "./fitText";
import mode from "../mode";

/**
 * Drawing and dragging of a graph node using Raphael
 */
export class Box {
  /**
   * @param  {} mutations - Mutations to perform on state
   * @param  {Paper} paper - Rafphael Paper object
   */
  constructor(id, mutations, paper) {
    this.id = id;
    this.mutations = mutations;
    this.paper = paper;

    this.moveEvent = new LiteEvent();
    this.moveEndEvent = new LiteEvent();
    this.clickEvent = new LiteEvent();
    this.dblClickEvent = new LiteEvent();
  }

  update(state) {
    if (!this.box) throw new Error("Component not initialized");

    this.box.attr("fill", state.fill ? state.fill : "blue");
    this.box.attr("stroke-width", state.strokeWidth ? state.strokeWidth : 2);
    this.box.attr("stroke", state.stroke ? state.stroke : "black");
    this.box.attr({ x: state.x, y: state.y });
    this.text.attr({ x: state.x, y: state.y });
  }

  create(state) {
    this.box = this.paper.rect(state.x, state.y, state.w, state.h);
    this.text = this.paper.text(state.x, state.y, this.id).fitText(state.w);

    this.box.attr("fill", state.fill);
    this.box.attr("stroke-width", state.strokeWidth);
    this.box.attr("stroke", state.stroke);
    this.text.attr("stroke-width", 0.5);

    this.box.drag(
      this.move.bind(this),
      this.start.bind(this),
      this.end.bind(this)
    );

    this.box.dblclick(() => {
      this.dblClickEvent.trigger();
    });

    this.box.click(() => {
      this.clickEvent.trigger();
    });
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
    this.x = this.ox + dx;
    this.y = this.oy + dy;
    this.box.attr({ x: this.x, y: this.y });
    this.text.attr({ x: this.x, y: this.y });
  }

  /**
   * End moving the box
   * @private
   */
  end() {
    this.mutations.setPosition(this.id, this.x, this.y);
    this.moveEndEvent.trigger();
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
