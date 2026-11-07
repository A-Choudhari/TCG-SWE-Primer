"use client";

import { useEffect, useState } from "react";

import { getAllProjects, type Project } from "../../api/projects";
import { getAssociatesByProjectId } from "../../api/associates";
import { getAllUsers } from "../../api/users";
import styles from "./project_display.module.css";

type ProjectDisplayProps = {
	refreshTrigger?: number;
};

export default function ProjectDisplay({ refreshTrigger = 0 }: ProjectDisplayProps) {
	const [projects, setProjects] = useState<Project[]>([]);
	const [usernamesById, setUsernamesById] = useState<Record<number, string>>({});
	const [associatesByProjectId, setAssociatesByProjectId] = useState<Record<number, number[]>>({});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadProjects = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const [allProjects, allUsers] = await Promise.all([getAllProjects(), getAllUsers()]);
				const nameMap = Object.fromEntries(allUsers.map((user) => [user.id, user.user_name]));
				const associatesEntries = await Promise.all(
					allProjects.map(async (project) => {
						try {
							const associates = await getAssociatesByProjectId(project.id);
							return [project.id, associates.map((associate) => associate.associate_id)] as const;
						} catch {
							return [project.id, [] as number[]] as const;
						}
					}),
				);

				setProjects(allProjects);
				setUsernamesById(nameMap);
				setAssociatesByProjectId(Object.fromEntries(associatesEntries));
			} catch (err) {
				const message = err instanceof Error ? err.message : "Failed to load projects";
				setError(message);
			} finally {
				setIsLoading(false);
			}
		};

		void loadProjects();
	}, [refreshTrigger]);

	if (isLoading) {
		return <p>Loading projects...</p>;
	}

	if (error) {
		return <p className={styles.error}>{error}</p>;
	}

	if (projects.length === 0) {
		return <p>No projects found.</p>;
	}

	return (
		<div className={styles.tableWrap}>
			<table className={styles.table}>
				<thead className={styles.head}>
					<tr>
						<th className={styles.cell}>ID</th>
						<th className={styles.cell}>Project Name</th>
						<th className={styles.cell}>Manager</th>
						<th className={styles.cell}>Associates</th>
						<th className={styles.cell}>Description</th>
					</tr>
				</thead>
				<tbody>
					{projects.map((project) => {
						const associateIds = associatesByProjectId[project.id] ?? [];
						return (
							<tr key={project.id} className={styles.row}>
								<td className={styles.cell}>{project.id}</td>
								<td className={styles.cell}>{project.project_name}</td>
								<td className={styles.cell}>
									{usernamesById[project.project_manager_id] ?? `User ${project.project_manager_id}`}
								</td>
								<td className={styles.cell}>
									{associateIds.length === 0 ? (
										"None"
									) : (
										<div className={styles.associateCells}>
											{associateIds.map((associateId) => (
												<span key={associateId} className={styles.associateCell}>
													{usernamesById[associateId] ?? `User ${associateId}`}
												</span>
											))}
										</div>
									)}
								</td>
								<td className={styles.cell}>{project.project_description}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
