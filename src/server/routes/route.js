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
   * @param {...Object} routes - Route objects
   * @param {string} routes[].method - HTTP method
   * @param {string} routes[].url - Route URL path
   * @param {Function} [routes[].preHandler] - Optional pre-handler function
   * @param {Function} routes[].handler - Route handler function
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
   * @returns {Object[]} The list of registered routes
   * @property {string} method - HTTP method
   * @property {string} url - Route URL path
   * @property {Function} handler - Route handler function
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
