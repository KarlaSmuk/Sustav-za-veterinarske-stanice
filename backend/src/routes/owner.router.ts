import { Router } from "express";
import { getOwners } from "../controllers/owner.controller";

const ownerRoute = Router();

ownerRoute.get("/", getOwners);

export default ownerRoute;