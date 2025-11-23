import Fastify from "fastify";

export function buildApp() {
  const app = Fastify({
    logger: true, // you can set it to false in prod
  });

  // route exemple
  app.get("/api/health", async () => {
    return { status: "ok" };
  });

  return app;
}
