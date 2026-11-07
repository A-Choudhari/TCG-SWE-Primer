"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import AddProjectForm from "../../components/add_project_form/add_project_form";
import AssignUserToProjectForm from "../../components/assign_user_to_project_form/assign_user_to_project_form";
import ProjectDisplay from "../../components/project_display/project_display";
import styles from "./projects_page.module.css";

export default function ProjectsPage() {
  const [projectRefreshKey, setProjectRefreshKey] = useState(0);

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <div className={styles.brand}>TCG Project Management Dashboard</div>
          <div className={styles.navLinks}>
            <Link href="/users" className={styles.navButton}>Users</Link>
            <Link href="/projects" className={`${styles.navButton} ${styles.navButtonActive}`}>Projects</Link>
          </div>
        </div>
        <div className={styles.logoWrap}><Image src="/tcg_logo.png" alt="Logo" width={100} height={40} /></div>
      </nav>
      <main className={styles.main}>
        <section className={styles.card}>
          <AddProjectForm onProjectAdded={() => setProjectRefreshKey((previous) => previous + 1)} />
          <AssignUserToProjectForm onAssignmentAdded={() => setProjectRefreshKey((previous) => previous + 1)} />
          <ProjectDisplay refreshTrigger={projectRefreshKey} />
        </section>
      </main>
    </div>
  );
}
