var canvas = document.getElementById("canvas");
var ng = new NestedGraph(canvas, testGraph);

document.getElementById("up").addEventListener("click", () => {
  ng.up();
});
