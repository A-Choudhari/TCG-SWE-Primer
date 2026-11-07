import { Request, Response } from "express";
import { supabase } from "../app";

// Supabase error code returned by .single() when no row matches
const NO_ROWS_FOUND = "PGRST116";

// Returns the ID as a positive integer, or null if the URL value isn't a valid ID
const getIdParam = (param: string | string[] | undefined): number | null => {
    const value = Number(Array.isArray(param) ? param[0] : param);
    return Number.isInteger(value) && value > 0 ? value : null;
};

const checkUserExists = async (userId: number) => {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle(); // returns null data (not an error) when no user matches
    if (error) {
        console.error("Error checking if user exists:", error);
        return false;
    }
    return !!data;
};

// GET /projects/:id - Get project by ID
export const getProjectById = async (req: Request, res: Response) => {
    const projectId = getIdParam(req.params.id);
    if (projectId === null) {
        return res.status(400).json({ error: "Invalid project ID" });
    }
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();
    if (error) {
        if (error.code === NO_ROWS_FOUND) {
            return res.status(404).json({ error: "Project not found" });
        }
        console.error("Error fetching project by ID:", error);
        return res.status(500).json({ error: "Failed to fetch project" });
    }
    return res.json(data);
};

// GET /projects/all - Get all projects
export const getAllProjects = async (_req: Request, res: Response) => {
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("id", { ascending: true });
    if (error) {
        console.error("Error fetching all projects:", error);
        return res.status(500).json({ error: "Failed to fetch projects" });
    }
    return res.json(data);
};

// GET /projects/manager/:manager_id - Get projects by manager ID
export const getProjectsByManagerId = async (req: Request, res: Response) => {
    const managerId = getIdParam(req.params.manager_id);
    if (managerId === null) {
        return res.status(400).json({ error: "Invalid manager ID" });
    }
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("project_manager_id", managerId);
    if (error) {
        console.error("Error fetching projects by manager ID:", error);
        return res.status(500).json({ error: "Failed to fetch projects" });
    }
    return res.json(data);
};

// POST /projects - Create a new project
export const createProject = async (req: Request, res: Response) => {
    const { project_name, project_manager_id, project_description } = req.body ?? {};
    if (!project_name || project_manager_id === undefined) {
        return res.status(400).json({ error: "project_name and project_manager_id are required" });
    }
    const managerExists = await checkUserExists(Number(project_manager_id));
    if (!managerExists) {
        return res.status(400).json({ error: "Invalid project manager ID" });
    }
    const projectData = {
        project_name,
        project_manager_id,
        ...(project_description !== undefined && { project_description }),
    };
    const { data, error } = await supabase
        .from("projects")
        .insert(projectData)
        .select("*")
        .single();
    if (error) {
        console.error("Error creating project:", error);
        return res.status(500).json({ error: "Failed to create project" });
    }
    return res.status(201).json(data);
};

// PUT /projects/:id - Update a project by ID
export const updateProjectById = async (req: Request, res: Response) => {
    const projectId = getIdParam(req.params.id);
    if (projectId === null) {
        return res.status(400).json({ error: "Invalid project ID" });
    }
    const { project_name, project_manager_id, project_description } = req.body ?? {};
    if (project_manager_id !== undefined) {
        const managerExists = await checkUserExists(Number(project_manager_id));
        if (!managerExists) {
            return res.status(400).json({ error: "Invalid project manager ID" });
        }
    }
    const projectData = {
        ...(project_name !== undefined && { project_name }),
        ...(project_manager_id !== undefined && { project_manager_id }),
        ...(project_description !== undefined && { project_description }),
    };
    if (Object.keys(projectData).length === 0) {
        return res.status(400).json({ error: "No fields provided to update" });
    }
    const { data, error } = await supabase
        .from("projects")
        .update(projectData)
        .eq("id", projectId)
        .select("*")
        .single();
    if (error) {
        if (error.code === NO_ROWS_FOUND) {
            return res.status(404).json({ error: "Project not found" });
        }
        console.error("Error updating project by ID:", error);
        return res.status(500).json({ error: "Failed to update project" });
    }
    return res.json(data);
};

// DELETE /projects/:id - Delete a project by ID
export const deleteProjectById = async (req: Request, res: Response) => {
    const projectId = getIdParam(req.params.id);
    if (projectId === null) {
        return res.status(400).json({ error: "Invalid project ID" });
    }
    // Remove associate rows first so the foreign key on associates.project_id doesn't block the delete
    const { error: associatesError } = await supabase
        .from("associates")
        .delete()
        .eq("project_id", projectId);
    if (associatesError) {
        console.error("Error deleting project associates:", associatesError);
        return res.status(500).json({ error: "Failed to delete project" });
    }
    const { data, error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId)
        .select("*")
        .single();
    if (error) {
        if (error.code === NO_ROWS_FOUND) {
            return res.status(404).json({ error: "Project not found" });
        }
        console.error("Error deleting project by ID:", error);
        return res.status(500).json({ error: "Failed to delete project" });
    }
    return res.json(data);
};
