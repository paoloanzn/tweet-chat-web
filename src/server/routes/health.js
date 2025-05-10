import Route from "./route.js";
import packageJson from "../package.json" with { type: "json" };

const healthRoute = new Route("/health");

const routes = [
  {
    method: "GET",
    url: "/status",
    handler: (_, reply) => {
      reply.status(200).send({
        status: "success",
        message: "online"
      })
      return;
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
