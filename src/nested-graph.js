import { LiteEvent } from "./util/lite-event";

/**
 * Orchestration of the drawing of the graph to the surface and managing of dragging and clicking events.
 */
export class NestedGraph {
  /**
   * @param  {Surface} surface - Surface to draw on
   * @param  {} graphConfig - Graph config
   */
  constructor(surface, graphConfig) {
    this.surface = surface;
    this.graphConfig = graphConfig;

    this.render(graphConfig.graphs.find(x => x.metadata.active));
  }

  /**
   * Render graph to surface
   * @private
   * @param {} graph - Graph config
   */
  render(graph) {
    this.current = graph;
    this.surface.clear();

    //create nodes
    let nodeMap = {};
    graph.nodes.filter(node => node.metadata !== undefined).forEach(node => {
      let isNested = node.metadata.graphId !== undefined;
      let box = this.surface.createBox(node.id, isNested);

      //update graph configuration when box position has changed
      box.moveEvent.on(() => {
        let bbox = box.bbox();
        node.metadata.x = bbox.x;
        node.metadata.y = bbox.y;
      });

      //draw child graph when clicking
      if (isNested) {
        box.clickEvent.on(() => {
          let g = this.graphConfig.graphs.find(
            x => x.metadata && x.metadata.id === node.metadata.graphId
          );

          this.render(g);
        });
      }

      //make sure we are inside paper
      box.moveEndEvent.on(() => {
        let bbox = box.bbox();
        let x = bbox.x < 0 ? 0 : bbox.x;
        let y = bbox.y < 0 ? 0 : bbox.y;
        if (x > this.surface.width - bbox.width) {
          x = this.surface.width - bbox.width;
        }
        if (y > this.surface.height - bbox.height) {
          y = this.surface.height - bbox.height;
        }
        box.setPosition(x, y);
      });

      box.render(node.metadata.x, node.metadata.y);
      nodeMap[node.id] = box;
    });

    //create connectors
    graph.edges.forEach(x => {
      let c = this.surface.createConnector(
        nodeMap[x.source],
        nodeMap[x.target]
      );
      c.render();
    });

    return nodeMap;
  }

  /**
   * Find the parent of the current graph
   * @private
   */
  findParentGraph() {
    return this.graphConfig.graphs.find(g =>
      this.hasChildGraph(this.current.metadata.id, g)
    );
  }

  /**
   * Does any of the nodes in the graph have the given child graph
   * @private
   */
  hasChildGraph(graphId, graph) {
    return graph.nodes
      .filter(x => x.metadata !== null)
      .some(x => x.metadata.graphId === graphId);
  }

  /**
   * Move up the the graph higher in the drilldown stack (if applicable)
   */
  up() {
    let g = this.findParentGraph();
    if (g) this.render(g);
  }
}
