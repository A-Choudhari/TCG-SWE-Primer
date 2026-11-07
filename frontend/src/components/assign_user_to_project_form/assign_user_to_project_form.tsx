"use client";

import { FormEvent, useEffect, useState } from "react";

import { createAssociate, getAssociatesByProjectId } from "../../api/associates";
import { getAllProjects, type Project } from "../../api/projects";
import { getAllUsers, type User } from "../../api/users";
import styles from "./assign_user_to_project_form.module.css";

type AssignUserToProjectFormProps = {
	onAssignmentAdded?: () => void;
};

export default function AssignUserToProjectForm({ onAssignmentAdded }: AssignUserToProjectFormProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoadingOptions, setIsLoadingOptions] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [projects, setProjects] = useState<Project[]>([]);
	const [users, setUsers] = useState<User[]>([]);
	const [selectedProjectId, setSelectedProjectId] = useState("");
	const [selectedUserId, setSelectedUserId] = useState("");

	// Load projects and users each time the form is opened so the dropdowns are current
	useEffect(() => {
		if (!isExpanded) {
			return;
		}
		const loadOptions = async () => {
			setIsLoadingOptions(true);
			try {
				const [allProjects, allUsers] = await Promise.all([getAllProjects(), getAllUsers()]);
				setProjects(allProjects);
				setUsers(allUsers);
			} catch (err) {
				const message = err instanceof Error ? err.message : "Failed to load projects and users.";
				setError(message);
			} finally {
				setIsLoadingOptions(false);
			}
		};
		void loadOptions();
	}, [isExpanded]);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);
		setSuccessMessage(null);

		if (!selectedProjectId || !selectedUserId) {
			setError("Please select both a project and a user.");
			return;
		}

		const projectId = Number(selectedProjectId);
		const userId = Number(selectedUserId);

		try {
			setIsSubmitting(true);

			const existingAssociates = await getAssociatesByProjectId(projectId);
			if (existingAssociates.some((associate) => associate.associate_id === userId)) {
				setError("That user is already assigned to this project.");
				return;
			}

			await createAssociate({ project_id: projectId, associate_id: userId });
			onAssignmentAdded?.();

			const userName = users.find((user) => user.id === userId)?.user_name ?? `User ${userId}`;
			const projectName =
				projects.find((project) => project.id === projectId)?.project_name ?? `Project ${projectId}`;
			setSuccessMessage(`Assigned ${userName} to ${projectName}.`);
			setSelectedUserId("");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Failed to assign user to project.";
			setError(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className={styles.container}>
			<button
				className={styles.toggleButton}
				type="button"
				onClick={() => {
					setIsExpanded((previous) => !previous);
					setError(null);
					setSuccessMessage(null);
				}}
				aria-expanded={isExpanded}
				aria-controls="assign-user-form"
			>
				{isExpanded ? "Hide Assign User Form" : "Assign User to Project"}
			</button>

			{isExpanded && (
				<form id="assign-user-form" className={styles.form} onSubmit={handleSubmit}>
					<label className={styles.label}>
						Project
						<select
							className={styles.input}
							value={selectedProjectId}
							disabled={isLoadingOptions}
							onChange={(event) => setSelectedProjectId(event.target.value)}
						>
							<option value="">{isLoadingOptions ? "Loading projects..." : "Select a project"}</option>
							{projects.map((project) => (
								<option key={project.id} value={project.id}>
									{project.project_name}
								</option>
							))}
						</select>
					</label>

					<label className={styles.label}>
						User
						<select
							className={styles.input}
							value={selectedUserId}
							disabled={isLoadingOptions}
							onChange={(event) => setSelectedUserId(event.target.value)}
						>
							<option value="">{isLoadingOptions ? "Loading users..." : "Select a user"}</option>
							{users.map((user) => (
								<option key={user.id} value={user.id}>
									{user.user_name}
								</option>
							))}
						</select>
					</label>

					<button className={styles.submitButton} type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Assigning..." : "Assign User"}
					</button>
				</form>
			)}

			{error && <p className={styles.error}>{error}</p>}
			{successMessage && <p className={styles.success}>{successMessage}</p>}
		</section>
	);
}
