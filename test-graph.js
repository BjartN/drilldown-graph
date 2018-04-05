let testGraph = {
  nodes: [
    {
      id: "a",
      x: 10,
      y: 10,
      nodes: [
        {
          id: "a2",
          x: 10,
          y: 700,
          nodes: [
            { id: "a3", x: 10, y: 10 },
            { id: "b3", x: 700, y: 10 },
            { id: "c3", x: 10, y: 350 },
            { id: "d3", x: 700, y: 350 }
          ],
          connectors: [
            { from: "a3", to: "b3" },
            { from: "b3", to: "c3" },
            { from: "c3", to: "d3" }
          ]
        },
        { id: "b2", x: 700, y: 10 }
      ],
      connectors: [{ from: "a2", to: "b2" }]
    },
    { id: "b", x: 700, y: 10 },
    { id: "c", x: 10, y: 200 },
    { id: "d", x: 10, y: 400 },
    { id: "e", x: 350, y: 600 },
    { id: "f", x: 700, y: 400 }
  ],
  connectors: [
    { from: "a", to: "b" },
    { from: "b", to: "c" },
    { from: "b", to: "c" },
    { from: "c", to: "d" },
    { from: "e", to: "f" },
    { from: "d", to: "f" }
  ]
};
