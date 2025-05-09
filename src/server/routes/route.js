import * as path from "path";

/**
 * Class representing a collection of Fastify routes.
 *
 * @class Route
 */
class Route {
  /**
   * Create a Route instance.
   *
   * @constructor
   * @param {string} [rootUrl="/"] - The root URL for all routes.
   */
  constructor(rootUrl = "/") {
    this.rootUrl = rootUrl;
    this.routes = [];
  }

  /**
   * Add one or more routes.
   * @param  {...{method: string, url: string, [preHandler]: (request, reply, done) => Promise<any>, handler: (request, reply) => Promise<any> }} routes
   */
  addRoutes(...routes) {
    routes.forEach(({ method, url, preHandler, handler }) => {
      const fullUrl = path.join(this.rootUrl, url);
      if (!preHandler) {
        this.routes.push({ method, url: fullUrl, handler });
      } else {
        this.routes.push({ method, url: fullUrl, preHandler, handler });
      }
    });
  }

  /**
   * Return an array of Fastify route definitions.
   * @returns {Array<{method: string, url: string, handler: (request: any, reply: any) => Promise<any>}>} The list of registered routes.
   */
  getRoutes() {
    return this.routes;
  }

  /**
   * Register all routes with the Fastify instance.
   *
   * @param {Fastify} fastify - The Fastify instance.
   */
  register(fastify) {
    this.getRoutes().forEach((route) => fastify.route(route));
  }
}

export default Route;
