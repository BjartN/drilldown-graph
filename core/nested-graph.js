class NestedGraph {
  constructor(canvas, config) {
    this.c = {
      width: canvas.offsetWidth,
      height: canvas.offsetHeight,
      center: { x: canvas.offsetWidth / 2, y: canvas.offsetHeight / 2 }
    };

    this.stack = [];
    this.paper = Raphael(canvas, this.c.width, this.c.height);
    this.drawGraph(config.graph);
  }

  up() {
    if (this.stack.length > 1) {
      this.stack.pop();
      let last = this.stack[this.stack.length - 1];
      this.drawGraph(last);
      this.stack.pop();
    }
  }

  drawGraph(graph) {
    this.paper.clear();
    this.stack.push(graph);

    //create nodes
    let nodeMap = {};
    graph.nodes.forEach(x => {
      let isNested = x.graph !== undefined;
      let box = new Box(x.id, this.paper, isNested);

      //update graph configuration when box position has changed
      box.moveEvent.on(() => {
        let bbox = box.bbox();
        x.x = bbox.x;
        x.y = bbox.y;
      });

      //draw child graph when clicking
      if (isNested) {
        box.clickEvent.on(() => {
          this.drawGraph(x.graph);
        });
      }

      //make sure we are inside paper
      box.moveEndEvent.on(() => {
        let bbox = box.bbox();
        let x = bbox.x < 0 ? 0 : bbox.x;
        let y = bbox.y < 0 ? 0 : bbox.y;
        if (x > this.c.width - bbox.width) {
          x = this.c.width - bbox.width;
        }
        if (y > this.c.height - bbox.height) {
          y = this.c.height - bbox.height;
        }

        box.setPosition(x, y);
      });

      box.drawBox(x.x, x.y);
      nodeMap[x.id] = box;
    });

    //create connectors
    graph.connectors.forEach(x => {
      let c = new Connector(this.paper, nodeMap[x.from], nodeMap[x.to]);
      c.drawLine();
    });

    return nodeMap;
  }
}
