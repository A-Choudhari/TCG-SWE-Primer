"use client";

import { FormEvent, useEffect, useState } from "react";

import { createProject } from "../../api/projects";
import { getAllUsers, type User } from "../../api/users";
import { createAssociate } from "../../api/associates";
import styles from "./add_project_form.module.css";

type AddProjectFormState = {
	project_name: string;
	project_manager_id: string;
	project_description: string;
	associate_ids: number[];
};

const initialFormState: AddProjectFormState = {
	project_name: "",
	project_manager_id: "",
	project_description: "",
	associate_ids: [],
};

type AddProjectFormProps = {
	onProjectAdded?: () => void;
};

export default function AddProjectForm({ onProjectAdded }: AddProjectFormProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [formData, setFormData] = useState<AddProjectFormState>(initialFormState);
	const [users, setUsers] = useState<User[]>([]);
	const [isLoadingUsers, setIsLoadingUsers] = useState(false);

	// Load the user list each time the form is opened so newly added members show up
	useEffect(() => {
		if (!isExpanded) {
			return;
		}
		const loadUsers = async () => {
			setIsLoadingUsers(true);
			try {
				setUsers(await getAllUsers());
			} catch (err) {
				const message = err instanceof Error ? err.message : "Failed to load users.";
				setError(message);
			} finally {
				setIsLoadingUsers(false);
			}
		};
		void loadUsers();
	}, [isExpanded]);

	const toggleAssociate = (userId: number) => {
		setFormData((previous) => ({
			...previous,
			associate_ids: previous.associate_ids.includes(userId)
				? previous.associate_ids.filter((id) => id !== userId)
				: [...previous.associate_ids, userId],
		}));
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);
		setSuccessMessage(null);

		const projectName = formData.project_name.trim();
		if (!projectName || !formData.project_manager_id) {
			setError("Project name and manager are required.");
			return;
		}

		try {
			setIsSubmitting(true);
			const project = await createProject({
				project_name: projectName,
				project_manager_id: Number(formData.project_manager_id),
				project_description: formData.project_description.trim(),
			});

			// The project now exists, so a failed associate assignment shouldn't hide that
			const results = await Promise.allSettled(
				formData.associate_ids.map((associateId) =>
					createAssociate({ project_id: project.id, associate_id: associateId }),
				),
			);
			const failedCount = results.filter((result) => result.status === "rejected").length;

			onProjectAdded?.();
			setFormData(initialFormState);
			setIsExpanded(false);

			if (failedCount > 0) {
				setError(`Project created, but ${failedCount} associate assignment(s) failed.`);
			} else {
				setSuccessMessage("Project added successfully.");
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : "Failed to create project.";
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
				aria-controls="add-project-form"
			>
				{isExpanded ? "Hide Add Project Form" : "Add Project"}
			</button>

			{isExpanded && (
				<form id="add-project-form" className={styles.form} onSubmit={handleSubmit}>
					<label className={styles.label}>
						Project Name
						<input
							className={styles.input}
							type="text"
							value={formData.project_name}
							onChange={(event) =>
								setFormData((previous) => ({ ...previous, project_name: event.target.value }))
							}
						/>
					</label>

					<label className={styles.label}>
						Manager
						<select
							className={styles.input}
							value={formData.project_manager_id}
							disabled={isLoadingUsers}
							onChange={(event) =>
								setFormData((previous) => ({ ...previous, project_manager_id: event.target.value }))
							}
						>
							<option value="">{isLoadingUsers ? "Loading users..." : "Select a manager"}</option>
							{users.map((user) => (
								<option key={user.id} value={user.id}>
									{user.user_name}
								</option>
							))}
						</select>
					</label>

					<label className={styles.label}>
						Description
						<textarea
							className={`${styles.input} ${styles.textarea}`}
							value={formData.project_description}
							onChange={(event) =>
								setFormData((previous) => ({ ...previous, project_description: event.target.value }))
							}
						/>
					</label>

					<fieldset className={styles.fieldset}>
						<legend className={styles.legend}>Associates (optional)</legend>
						{users.length === 0 ? (
							<span className={styles.hint}>
								{isLoadingUsers ? "Loading users..." : "No users available."}
							</span>
						) : (
							users.map((user) => (
								<label key={user.id} className={styles.checkboxLabel}>
									<input
										type="checkbox"
										checked={formData.associate_ids.includes(user.id)}
										onChange={() => toggleAssociate(user.id)}
									/>
									{user.user_name}
								</label>
							))
						)}
					</fieldset>

					<button className={styles.submitButton} type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Saving..." : "Save Project"}
					</button>
				</form>
			)}

			{error && <p className={styles.error}>{error}</p>}
			{successMessage && <p className={styles.success}>{successMessage}</p>}
		</section>
	);
}
