import { FastifyInstance } from "fastify";
import * as masterController from "../controllers/master.controller.js";


export default async function masterRoutes(
  app: FastifyInstance
) {

  app.get(
    "/master/dashboard",
    masterController.dashboard
  );

}