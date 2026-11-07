import { Router } from "express";
import * as projectsController from "../controllers/projects";

const router = Router();

// Literal routes must come before "/:id", otherwise Express treats "all" or "manager" as an ID.

// GET /projects/all - Get all projects
router.get("/all", projectsController.getAllProjects);

// GET /projects/manager/:manager_id - Get projects by manager ID
router.get("/manager/:manager_id", projectsController.getProjectsByManagerId);

// GET /projects/:id - Get project by ID
router.get("/:id", projectsController.getProjectById);

// POST /projects - Create a new project
router.post("/", projectsController.createProject);

// PUT /projects/:id - Update a project by ID
router.put("/:id", projectsController.updateProjectById);

// DELETE /projects/:id - Delete a project by ID
router.delete("/:id", projectsController.deleteProjectById);

export default router;
