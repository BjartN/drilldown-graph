let testGraph = {
  nodes: [
    {
      id: "Component1",
      x: 10,
      y: 10,
      nodes: [
        {
          id: "a",
          x: 10,
          y: 700,
          nodes: [
            { id: "a", x: 10, y: 10 },
            { id: "b", x: 700, y: 10 },
            { id: "c", x: 10, y: 350 },
            { id: "d", x: 700, y: 350 }
          ],
          connectors: [
            { from: "a", to: "b" },
            { from: "b", to: "c" },
            { from: "c", to: "d" }
          ]
        },
        { id: "b", x: 700, y: 10 }
      ],
      connectors: [{ from: "a", to: "b" }]
    },
    { id: "Component2", x: 700, y: 10 },
    { id: "c", x: 10, y: 200 },
    { id: "d", x: 10, y: 400 },
    { id: "e", x: 350, y: 600 },
    { id: "f", x: 700, y: 400 }
  ],
  connectors: [
    { from: "Component1", to: "Component2" },
    { from: "Component2", to: "c" },
    { from: "Component1", to: "c" },
    { from: "c", to: "d" },
    { from: "e", to: "f" },
    { from: "d", to: "f" }
  ]
};
