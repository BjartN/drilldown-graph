import { LiteEvent } from "./util/lite-event";
import mode from "./mode";

/**
 * Orchestration of the drawing of the graph to the surface and managing of dragging and clicking events.
 */
export class NestedGraph {
  /**
   * @param  {Surface} surface - Surface to draw on
   * @param  {} graphConfig - Graph config
   */
  constructor(surface, graphConfig, modeId) {
    this.surface = surface;
    this.graphConfig = graphConfig;
    this.mode = modeId;

    NestedGraph.validateGraphs(graphConfig.graphs);
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

    let nodes = graph.nodes.forEach(node => {
      let isNested = node.metadata.graphId !== undefined;
      let box = this.surface.createBox(node.id, this.mode, isNested);

      //update graph configuration when box position has changed
      box.moveEvent.on(() => {
        let bbox = box.bbox();
        node.metadata.x = bbox.x;
        node.metadata.y = bbox.y;
      });

      box.clickEvent.on(() => {
        if (this.mode === mode.connect) {
          box.toggleSelect();
        }
      });

      box.dblClickEvent.on(() => {
        if (this.mode === mode.navigate) {
          this.dblClickEventNavigateMode(node);
        }
      });

      //make sure we are inside paper
      box.moveEndEvent.on(() => {
        let pt = this.calculateConstrainedPosition(box.bbox());
        box.setPosition(pt.x, pt.y);
      });

      box.render(node.metadata.x, node.metadata.y);
      nodeMap[node.id] = box;
    });

    //create connectors
    graph.edges.forEach(x => {
      let connector = this.surface.createConnector(
        nodeMap[x.source],
        nodeMap[x.target]
      );

      connector.clickEvent.on(() => {
        if (this.mode === mode.connect) {
          connector.toggleSelect();
        }
      });

      connector.render();
    });

    return nodeMap;
  }

  /**
   * Calcuate position of the box within the paper and make sure it does not disappear outside the paper.
   * @param {*} bbox - Bounding box of box
   * @private
   */
  calculateConstrainedPosition(bbox) {
    let x = bbox.x < 0 ? 0 : bbox.x;
    let y = bbox.y < 0 ? 0 : bbox.y;
    if (x > this.surface.width - bbox.width) {
      x = this.surface.width - bbox.width;
    }
    if (y > this.surface.height - bbox.height) {
      y = this.surface.height - bbox.height;
    }

    return { x, y };
  }

  /**
   * @private
   */
  dblClickEventNavigateMode(node) {
    let isNested = node.metadata.graphId !== undefined;
    if (!isNested) return;

    let g = this.findGraph(node.metadata.graphId);
    this.render(g);
  }

  /**
   * Find graph by id
   * @param {string} id - Graph Id
   * @private
   */
  findGraph(id) {
    return this.graphConfig.graphs.find(x => x.metadata.id === id);
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

  setMode(modeId) {
    this.mode = modeId;
  }

  static validateGraphs(graphs) {
    return graphs.every(x => NestedGraph.validateGraph(x));
  }

  /**
   * Validate graph data structure
   * @private
   */
  static validateGraph(graph) {
    let invalidNode = graph.nodes.some(
      node =>
        node.metadata === undefined ||
        node.metadata.x === undefined ||
        node.metadata.y === undefined
    );

    if (invalidNode) {
      throw new Error(
        "Invalid node detected. Node needs metadata.x and metdata.y"
      );
    }

    let invalidGraph =
      graph.metadata === undefined || graph.metadata.id === undefined;

    if (invalidGraph) {
      throw new Error("Invalid graph detected. Graph needs metadata.id");
    }

    return true;
  }
}
