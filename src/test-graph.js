//Loosely following http://jsongraphformat.info/ v3.0

export default {
  graphs: [
    {
      metadata: {
        id: "3"
      },
      nodes: [
        { id: "a3", metadata: { x: 10, y: 10 } },
        { id: "b3", metadata: { x: 700, y: 10 } },
        { id: "c3", metadata: { x: 10, y: 350 } },
        { id: "d3", metadata: { x: 700, y: 350 } }
      ],
      edges: [
        { source: "a3", target: "b3" },
        { source: "b3", target: "c3" },
        { source: "c3", target: "d3" }
      ]
    },
    {
      metadata: {
        id: "2",
        active: true
      },
      nodes: [
        {
          id: "a2",
          metadata: {
            x: 10,
            y: 700,
            graphId: "3"
          }
        },
        {
          id: "b2",
          metadata: { x: 700, y: 10 }
        }
      ],
      edges: [{ source: "a2", target: "b2" }]
    },
    {
      metadata: {
        id: "1"
      },
      nodes: [
        { id: "a", metadata: { x: 10, y: 10, graphId: "2" } },
        { id: "b", metadata: { x: 700, y: 10 } },
        { id: "c", metadata: { x: 10, y: 200 } },
        { id: "d", metadata: { x: 10, y: 400 } },
        { id: "e", metadata: { x: 350, y: 600 } },
        { id: "f", metadata: { x: 700, y: 400 } }
      ],
      edges: [
        { source: "a", target: "b" },
        { source: "b", target: "c" },
        { source: "b", target: "c" },
        { source: "c", target: "d" },
        { source: "e", target: "f" },
        { source: "d", target: "f" }
      ]
    }
  ]
};
