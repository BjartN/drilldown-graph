class Box {
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
    this.clickEvent = new LiteEvent();
  }

  drawBox(x, y) {
    this.box = this.paper.rect(x, y, this.width, this.height);
    this.box.attr("fill", this.isNested ? "yellow" : "#ececec");
    this.box.attr("stroke-width", 2);
    this.box.attr("stroke", "black");

    this.box.drag(this.move.bind(this), this.start.bind(this));
    this.box.dblclick(() => {
      this.clickEvent.trigger();
    });

    let tp = this.textPosition(x, y);
    this.text = this.paper.text(tp.x, tp.y, this.id).fitText(this.width);
    this.text.attr("stroke-width", 0.5);
    this.text.attr("stroke", "black");
  }

  start() {
    this.ox = this.box.attr("x");
    this.oy = this.box.attr("y");
  }

  textPosition(x, y) {
    return { x: x + this.paddingX, y: y + this.paddingY };
  }

  move(dx, dy) {
    let x = this.ox + dx;
    let y = this.oy + dy;

    this.moveEvent.trigger();

    this.text.attr(this.textPosition(x, y));
    this.box.attr({ x: x, y: y });
  }

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
