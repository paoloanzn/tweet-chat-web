import Route from "./route.js";
import packageJson from "../package.json" with { type: "json" };

const healthRoute = new Route("/health");

const routes = [
  {
    method: "GET",
    url: "/status",
    handler: () => {
      return "online";
    },
  },
  {
    method: "GET",
    url: "/version",
    handler: () => {
      return packageJson.version;
    },
  },
];

healthRoute.addRoutes(...routes);

export default healthRoute;
