import { LiteEvent } from "./util/lite-event";
import mode from "./mode";
import { State } from "./state";
import { Box } from "./raphael/box";
import { Mutation } from "./mutation";

/**
 * Orchestration of the drawing of the graph to the surface and managing of dragging and clicking events.
 */
export class NestedGraph {
  constructor(surface, graphConfig) {
    this.surface = surface;

    let stateData = {
      graphs: [
        {
          nodes: [
            {
              id: "node:1",
              x: 10,
              y: 10,
              w: 100,
              h: 100,
              stroke: "black",
              fill: "yellow",
              strokeWidth: 2
            },
            {
              id: "node:2",
              x: 100,
              y: 100,
              w: 100,
              h: 100,
              stroke: "black",
              fill: "yellow",
              strokeWidth: 2
            }
          ],
          edges: [{ id: "edge:1", source: "node:1", target: "node:2" }]
        }
      ]
    };

    let state = new State(stateData);
    let mutations = new Mutation(state);
    let graph = state.state.graphs[0];

    let components = graph.nodes.map(state => {
      return {
        component: this.surface.createBox(state.id, mutations),
        state: state
      };
    });

    let map = {};
    components.forEach(x => {
      map[x.state.id] = x;
    });

    components.forEach(x => x.component.create(x.state));
  }
}
