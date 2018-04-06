import { NestedGraph } from "./nested-graph";
import { Surface } from "./raphael/surface";
import testGraph from "./test-graph";

/**
 * Entry point of application.
 */
(function() {
  window.onload = function() {
    var canvas = document.getElementById("canvas");
    var ng = new NestedGraph(new Surface(canvas), testGraph);

    document.getElementById("up").addEventListener("click", () => {
      ng.up();
    });
  };
})();
