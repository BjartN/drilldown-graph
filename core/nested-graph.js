class NestedGraph {
  constructor(canvas, graph) {
    var c = {
      width: canvas.offsetWidth,
      height: canvas.offsetHeight,
      center: { x: canvas.offsetWidth / 2, y: canvas.offsetHeight / 2 }
    };

    this.stack = [];
    this.paper = Raphael(canvas, c.width, c.height);
    this.drawGraph(graph);
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
      let isNested = x.nodes !== undefined;
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
          this.drawGraph({ nodes: x.nodes, connectors: x.connectors });
        });
      }

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
