# TCG-SWE-Primer

Analyst/associate name: Akshat Choudhari

> **Note:** If you get stuck, the `main` branch contains a complete reference implementation. You're also welcome to use the internet. If you use AI, finish the introduction first and read our guidance on using it effectively.

Welcome to the SWE Primer for Triton Consulting Group! In this tutorial, you will learn the basics of MERN stack web development, with an emphasis on SQL databases. MERN is a widely used full-stack framework in industry. Here is what each letter stands for:

1. M = MongoDB. MongoDB is a free NoSQL (or non-relational database) database service that is used to store unstructured or generally variable data. Think of a MongoDB collection as a folder of JSON files, where each file (document) can have different keys — but unlike a real folder, you can query across all of them instantly with a database query. In this primer, you will actually not be using MongoDB, but Supabase. Supabase is a free SQL-based database service that allows for the storage of more structured data; think of it more like an Excel spreadsheet, where each row has to have information related to the columns that define it.
2. E = Express.js. Express is a minimal, open-source backend web application framework built for Node.js that simplifies building web applications through APIs (Application Programming Interfaces). In this primer, APIs are the primary way the frontend and backend communicate — Express is the library that makes this possible.
3. R = React. React is a JavaScript library for building interactive user interfaces. While traditional HTML/CSS/JS can become difficult to manage as applications grow - requiring complex coordination across multiple files and manual DOM manipulation - React simplifies this by letting you build UIs out of reusable components, each containing its own structure, styling, and logic in one place. React also introduces a declarative approach to managing state, so the UI automatically updates when your data changes, without you needing to wire everything up manually.
4. N = Node.js. Node is an open-source, cross-platform JavaScript runtime environment that powers our servers and web applications. It enables the web servers that run our frontend and backend, and provides the runtime Express runs on. Node's event-driven, non-blocking architecture makes it efficient at handling many simultaneous requests, making it a strong choice for scalable web applications. It also comes bundled with npm (Node Package Manager), giving developers access to a massive ecosystem of open-source libraries and tools.

This primer is split into three main sections, and each should only take you a couple of hours. Please try your best to complete each of these parts WITHOUT vibe-coding. Although using AI is an important skill to learn for software engineers nowadays, it is not an **additive** skill but a **multiplicative** one. If you do not know how to build web applications or understand where errors are coming from, using AI will only result in inefficient, insecure websites — red flags for our clients. However, if you have the core knowledge required, AI can help you become a significantly faster and better developer. 

P.S. If you want a deeper foundation in React before starting, I strongly recommend the Tic-Tac-Toe tutorial on the React homepage (https://react.dev/learn/tutorial-tic-tac-toe). It's how I first learned React, and it covers concepts you will definitely encounter here.

# Part 0: Introduction

Start by setting up your environment and exploring the codebase.

## Part 0-0: Installation and Setup
### Part 0-0-1: VS Code + Prettier + ESLint

First, install VS Code: https://code.visualstudio.com/download. Among the editors I've used, VS Code is both free and feature-rich, with an extensive ecosystem of developer tools — including officially released extensions like GitHub Copilot and Claude Code.

Once VS Code is installed, go to the Extensions panel and install both Prettier and ESLint. These tools enforce consistent code formatting and style rules, making your code more accurate and readable for yourself, your teammates, and the client.

### Part 0-0-2: Git

Git is the industry standard for version control — it tracks your code over time, lets you roll back breaking changes, and enables collaboration through branching and merging. Install Git from https://git-scm.com/install/ and create a GitHub account at https://github.com/. To verify the installation, open your terminal and run `git --version`. You should see something like `git version 2.x.x`. Then, before making your first commit, configure your identity using your GitHub name and email:
```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

This identity configuration will be attached to all your commits. To set up this repository, follow these steps:
1. Fork the repository by clicking the dropdown next to "Fork" and selecting "Create a New Fork". Uncheck "Copy the `main` branch only" so that all branches — including `incomplete` — are included in your fork.
2. Clone your fork onto your computer with `git clone [github fork URL]` in a directory of your choice.
3. Switch to the `incomplete` branch with `git switch incomplete`. To see all branches, run `git branch -a`.

You now have a remote fork on GitHub and a local clone on your device. Next, let's create your first commit and push it:
1. Always make changes on a dedicated branch and merge back into the target branch — this keeps changes isolated until they've been tested. Confirm you're on `incomplete` with `git branch -a`, then create a new branch with `git checkout -b change-readme`.
2. Open `README.md` and fill in the `Analyst/Associate Name:` field with your name.
3. Stage your changes with `git add .` — this tells Git which files to include in the next commit. You can also stage just the README with `git add README.md`.
4. Commit with `git commit -m "changed readme with my name"` (the message can be anything, but keep it short and descriptive). This saves a permanent snapshot to your local history with a unique ID, your name, and a timestamp.
5. Push with `git push` to copy the commit to your remote repository. If successful, you'll see a new `change-readme` branch on GitHub.
6. Finally, merge `change-readme` into `incomplete`. This is how real teams collaborate — each engineer works on their own branch and merges back when done. Run the following in your terminal:
   ```bash
   git switch incomplete
   git merge change-readme
   git push
   ```

   You should now be able to see your name on the README in the `incomplete` branch!

### Part 0-0-3: Node

Install Node from https://nodejs.org/en — select the LTS (Long-Term Support) version, as it is the most stable and production-ready build. Verify the installation with `node --version` (expect something like `v2X.XX.X`) and `npm --version` (expect `v10.X.X`), since npm comes bundled with Node.

Note: other version numbers are fine, especially if this guide hasn't been updated recently. Just make sure you're on a verified, stable release.

### Part 0-0-4: Postman

Postman is a desktop application for testing APIs by sending requests and inspecting responses. Install it from https://www.postman.com/downloads/. For this primer you won't need an account, but I recommend creating one for features like saving requests and sharing test collections with collaborators.

### Part 0-0-5: Supabase

Supabase is the free SQL database service used for this project — and most TCG projects going forward. Create an account at https://supabase.com/, create an organization and project, then navigate to "Project Settings" and extract the following values:
1. Under "General", you will find a project ID. This project ID will be used to form your Supabase URL, which is https://[project-id].supabase.co. 
2. Under "API Keys", navigate to the "Legacy anon, service_role API keys" section, and copy your service role key. This key bypasses Row Level Security (RLS) — Supabase's built-in access control system — which simplifies development by removing the need to configure access policies for each table.

Copy `/backend/.env.example` and rename it `.env`, then fill in `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` with the values above.

Note: NEVER share these values with an AI or anyone outside your team. When working on your own projects, make sure `.env` is listed in your `.gitignore` to prevent it from being committed to Git (it has already been added for this primer). Exposing API keys is a serious security risk — in production environments, it can lead to data breaches and significant financial loss.

## Part 0-1: Running the Repository

Open your local repository in VS Code and open a terminal from the top-left menu — it should already be pointed at your project directory. In the first terminal, run:
```bash
cd frontend
npm install
npm run dev
```

This navigates to the frontend directory, installs dependencies, and starts the development server at http://localhost:3000. You should see the app's basic structure, but no data will appear yet.

Then, create a new terminal within VS Code by clicking on the "+" button in the terminal window. Run the following commands to do the same for the backend:
```bash
cd backend
npm install
npm start
```

You should now have two terminals running — one for frontend logs and one for backend logs. If anything goes wrong, check these terminals first for error output.

# Part 1: Backend

## Part 1-1: Setting Up Supabase

At this point, you should already have your Supabase organization and project created, and your `.env` variables filled in. Now you need to create three tables with the following structure:

**`users`**
| Column | Type |
|---|---|
| `id` | int8 (primary key) |
| `created_at` | timestamptz |
| `user_name` | text |
| `user_grad_year` | int8 |
| `user_tcg_status` | text |
| `user_email` | text |

**`projects`**
| Column | Type |
|---|---|
| `id` | int8 (primary key) |
| `created_at` | timestamptz |
| `project_name` | text |
| `project_manager_id` | int8 (foreign key → `users.id`) |
| `project_description` | text |

**`associates`**
| Column | Type |
|---|---|
| `id` | int8 (primary key) |
| `created_at` | timestamptz |
| `project_id` | int8 (foreign key → `projects.id`) |
| `associate_id` | int8 (foreign key → `users.id`) |

A **foreign key** links a column in one table to the primary key of another, enforcing that the referenced row must exist. For example, `project_manager_id` references `users.id` because every project manager must be an existing user. The `associates` table is a **junction table** — each row represents one user's membership on one project, linking `users` and `projects` together.

To create these tables in Supabase:
1. Go to the "Table Editor" in the Supabase sidebar.
2. Click "New Table" and give it a name.
3. Add each column with the correct name, data type, and foreign key references where applicable.

Once all three tables are created, you are ready to build the backend APIs.

## Part 1-2: Creating the Project Controller and Routes

The `/backend` folder currently has no logic for interacting with the `projects` table. Let's fix that by building its API.

The first step is creating a **controller** — a set of functions containing the core logic for accessing, adding, editing, and deleting rows.

Here is what each request type does:
1. A GET request retrieves rows from a table to read.
2. A POST request creates new rows.
3. A PUT request edits existing rows.
4. A DELETE request removes a row from the table.

APIs also return different status codes depending on the outcome of the request:
- **200 OK** — the request succeeded and the response contains the expected data.
- **201 Created** — the request succeeded and a new resource was created (common for POST requests).
- **400 Bad Request** — the request was malformed or missing required fields (e.g. sending incomplete data).
- **401 Unauthorized** — the request lacks valid authentication credentials.
- **403 Forbidden** — the server understood the request but refuses to fulfill it (e.g. insufficient permissions).
- **404 Not Found** — the requested resource doesn't exist (e.g. querying an ID that isn't in the database).
- **500 Internal Server Error** — something went wrong on the server side (e.g. a bug in your backend code or a failed database query).

Not every API exposes all request types — the choice depends on what the API is meant to do. For example, the GitHub API lets you GET repository data publicly, but exposing a DELETE endpoint to all users would be a major security risk.

Open `projects.ts` in `/backend/controllers` and start with `getProjectById` — given a project ID, return that project's row. Define the function header:

```ts
export const getProjectById = async (req: Request, res: Response) => {}
```

Here's what each keyword does:
1. `export` allows the function to be called from other files.
2. `const` defines the function as a constant (i.e. it cannot be reassigned later in the file).
3. `getProjectById` is the name of the function.
4. `async` marks the function as asynchronous — if an operation takes time, it does not block other operations. This requires `await` inside the function, which pauses execution until the awaited response finishes.
5. `req: Request, res: Response` define the types for the incoming request and outgoing response.

Inside the curly braces, first extract the project ID from the request:
```ts
const projectId = req.params.id
```

`req.params` contains values embedded in the URL. In this case, we send a request to `localhost:4000/project/<id>`, and this line extracts that ID.

Now let's query Supabase. The Supabase client is already initialized in `app.ts` using the values from your `.env`. Use the following code to fetch the project with the given ID:

```ts
const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();
```

Here's what each chained method does:
1. `.from("projects")` specifies the table to query.
2. `.select("*")` selects all columns.
3. `.eq("id", projectId)` filters for rows where the `id` column matches `projectId`.
4. `.single()` ensures only one row is returned (since project IDs are unique).

Next, handle any errors:
```ts
if (error) {
    console.error("Error fetching project by ID:", error);
    return res.status(500).json({ error: "Failed to fetch project" });
}
```

We return a 500 here because this indicates a server-side failure (e.g. a bad database query), not a problem with the request itself.

Finally, return the data as JSON:
```ts
return res.json(data)
```

Your completed function should look like this:
```ts
// GET /project/:id - Get project by ID
export const getProjectById = async (req: Request, res: Response) => {
    const projectId = req.params.id;
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();
    if (error) {
        console.error("Error fetching project by ID:", error);
        return res.status(500).json({ error: "Failed to fetch project" });
    }
    return res.json(data);
};
```

In addition to URL parameters (`req.params`), you can also pass data through the **request body** — useful for POST and PUT requests where you don't want fields visible in the URL:

```ts
const { field1, field2, field3 } = req.body;
```

Now implement the remaining controllers on your own:
1. **GET** `/projects/all` — return all projects.
2. **POST** `/project` — create a new project. Accept `name`, `managerId`, and `description` in the request body. Import or copy `checkUserExists` from `users.ts` and verify that the provided manager exists before creating the project.
3. **PUT** `/project/:id` — update an existing project. Accept any combination of `name`, `managerId`, and `description`. If `managerId` is provided, verify that the user exists.
4. **DELETE** `/project/:id` — delete a project by ID.

Once the controllers are done, define the routes in `routes/projects.ts`. Reference `routes/associates.ts` for the pattern — each route follows this structure:

```ts
router.<method>('<url>', <controllerFile>.<controllerFunction>)
```

## Part 1-3: Testing the Project APIs

Now that you have defined the project controller, test each API using Postman:
1. Make sure the backend is running (`cd backend && npm start`).
2. Enter the API URL in the URL field (e.g. `http://localhost:4000/projects/all`).
3. Set the request type (GET, POST, PUT, or DELETE) using the dropdown to the left of the URL field.
4. Verify that each endpoint behaves as expected. GET, PUT, and DELETE should return `200 OK`; a successful POST should return `201 Created`.

> **Note:** If `/projects/all` returns an error about `all` not being a valid ID, check your route order. Express matches routes top-to-bottom, so if `/projects/:id` is defined before `/projects/all`, the `all` literal gets caught as an ID parameter. Define `/projects/all` first to fix this.


# Part 2: Frontend

If you open the frontend right now, you'll notice that the "Projects" page is empty. Your job is to build the components that populate it:
1. A project display component.
2. An add project form (creates a new project).
3. An assign user to project form (assigns an associate to a project).

We'll start with the project display component, located at `/frontend/components/project_display.tsx`. At a high level, you need to:
1. Build an HTML table to display project data.
2. Fetch that data from the backend and populate the table.

## Part 2.1: Frontend Structure with React

Following the same structure as the users display page, we'll use an HTML `<table>`. Start by defining the column headers inside a `<thead>` tag — the table will display the ID, project name, manager, associates, and description:

```tsx
<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Project Name</th>
            <th>Manager</th>
            <th>Associates</th>
            <th>Description</th>
        </tr>
    </thead>
</table>
```

This gives us the core table structure. Add a few example rows inside a `<tbody>` tag so you have something to style.

Now let's add CSS to make the table presentable. Apply the following styles to the table itself:

```css
.table {
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;
  border: 1px solid #cbd5e1;
  text-align: left;
  font-size: 0.875rem;
}
```

Here's what each property does:
1. `width: 100%` — the table fills its parent container (the `<div className={styles.tablewrap}>`).
2. `min-width: 640px` — prevents the table from shrinking below 640px even if the window gets smaller, avoiding broken layouts.
3. `border-collapse: collapse` — merges adjacent cell borders into a single line instead of rendering them as separate double borders.
4. `border: 1px solid #cbd5e1` — draws a 1px solid border around each cell in a slate-gray color.
5. `text-align: left` — left-aligns text inside all cells.
6. `font-size: 0.875rem` — sets the font size to 14px (0.875 × 16px base).

To apply a style class in React, use the `className` prop instead of `class`. Change `<table>` to `<table className={styles.table}>`.

Now it's your turn to style the remaining elements:
1. On the `<thead>` tag, add a `.head` class that sets the background color to `#f1f5f9`.
2. On each `<th>` cell, add a `.cell` class that adds padding around the text.

## Part 2.2: Adding the API Request Functions

To communicate with the backend, we define API helper functions in the `/api` folder. You can see existing examples in `users.ts` and `associates.ts` — your task is to create the equivalent file for projects.

First, define a custom `Project` type to match the shape of a project row from the database:
```ts
export type Project = {
    id: number;
    project_name: string;
    project_manager_id: number;
    project_description: string;
};
```

Next, let's walk through `getProjectById` as an example. Start with the function signature:
```ts
export const getProjectById = async (id: number): Promise<Project> => {}
```

Here's what each part means:
1. `export` — makes the function importable in other files (e.g. your React components).
2. `const getProjectById` — defines the function as a constant, so it can't be accidentally reassigned.
3. `async` — marks the function as asynchronous, since network requests take time.
4. `(id: number)` — accepts one parameter, `id`, typed as a number.
5. `: Promise<Project>` — the return type. An `async` function always returns a Promise; once resolved, it will contain a `Project` object.

Inside the function, call the backend using `fetch`. The frontend's `.env` file contains `NEXT_PUBLIC_BACKEND_URL` with the backend's base URL:
```ts
const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/${id}`);
```

Then add error handling:
```ts
if (!response.ok) {
    throw new Error(`Failed to fetch project with ID ${id}`);
}
```

Finally, parse and return the response as a `Project`:
```ts
const data = (await response.json()) as Project;
return data;
```

Now implement a helper function for every project API endpoint. For PUT and POST requests, you'll need to include a `method`, `headers`, and `body` in the `fetch` call:
```ts
method: "POST",
headers: {
    "Content-Type": "application/json",
},
body: JSON.stringify(<object>),
```

## Part 2.3: Using React Hooks

React hooks let you manage component state and side effects in a clean, declarative way. This section covers `useState` and `useEffect`, the two hooks you'll use most.

- `useState` lets a component hold a piece of data that can change over time. When the data updates, React automatically re-renders the component.
- `useEffect` lets a component run side effects — operations that happen outside of rendering, like fetching data from an API when the page loads.

To build the project display component, start by declaring the state variables you'll need at the top of the component function:

```tsx
const [projects, setProjects] = useState<Project[]>([]);
const [usernamesById, setUsernamesById] = useState<Record<number, string>>({});
const [associatesByProjectId, setAssociatesByProjectId] = useState<Record<number, number[]>>({});
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

Here's what each state holds:
- `projects` — the list of all projects fetched from the database, initialized to an empty array.
- `usernamesById` — a lookup map from user ID to username (e.g. `{ 1: "Alice", 3: "Bob" }`). Used to display manager and associate names without extra API calls. `Record<number, string>` means the keys are numbers and the values are strings.
- `associatesByProjectId` — a lookup map from project ID to an array of associate IDs (e.g. `{ 5: [2, 7, 9], 8: [1, 4] }`). `Record<number, number[]>` means the keys are numbers and the values are arrays of numbers.
- `isLoading` — a boolean that starts as `true` and flips to `false` once all data has loaded.
- `error` — holds an error message string if something goes wrong, or `null` if everything succeeded.

Using `Record` instead of arrays makes lookups fast and simple — instead of searching through a list, you can access a value directly with `usernamesById[project.project_manager_id]`.

Now, set up the `useEffect` that fetches data when the component mounts:
```tsx
useEffect(() => {
    const loadProjects = async () => {
        setIsLoading(true);
        setError(null);
        // TODO: fetch projects, associates, and usernames, then set state
    };

    void loadProjects();
}, [refreshTrigger]);
```

The `useEffect` runs once when the component first renders (and again whenever `refreshTrigger` changes). Inside it, we define `loadProjects` as an async function and call it immediately. The `void` prefix tells TypeScript we're intentionally ignoring the returned Promise.

Now let's fill in `loadProjects`. First, fetch all projects and users in parallel using `Promise.all`:
```ts
const [allProjects, allUsers] = await Promise.all([getAllProjects(), getAllUsers()]);
```

`Promise.all` runs both requests simultaneously and waits for both to finish before continuing — more efficient than awaiting them one at a time.

Next, build the `usernamesById` map from the users list:
```ts
const nameMap = Object.fromEntries(allUsers.map((user) => [user.id, user.user_name]));
```

`Object.fromEntries` converts an array of `[key, value]` pairs into an object. Here, we map each user to a `[id, username]` pair.

Then, fetch associates for each project and build the `associatesByProjectId` map:
```ts
const associatesEntries = await Promise.all(
    allProjects.map(async (project) => {
        try {
            const associates = await getAssociatesByProjectId(project.id);
            return [project.id, associates.map((associate) => associate.associate_id)] as const;
        } catch {
            return [project.id, []] as const;
        }
    }),
);
```

For each project, this fetches its associates and extracts their IDs into an array. The `try/catch` ensures that if one project's associate fetch fails, it defaults to an empty list rather than crashing the entire load.

> Note: The `associates` table is a junction table between `users` and `projects` — it only stores user-project ID pairs. Any additional user or project details must be looked up from their respective tables, which is why we maintain the `usernamesById` map separately.

Finally, update all state variables and wrap the whole thing in error handling:
```tsx
const loadProjects = async () => {
    try {
        const [allProjects, allUsers] = await Promise.all([getAllProjects(), getAllUsers()]);
        const nameMap = Object.fromEntries(allUsers.map((user) => [user.id, user.user_name]));
        const associatesEntries = await Promise.all(
            allProjects.map(async (project) => {
                try {
                    const associates = await getAssociatesByProjectId(project.id);
                    return [project.id, associates.map((associate) => associate.associate_id)] as const;
                } catch {
                    return [project.id, []] as const;
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
```

The `finally` block runs regardless of success or failure, ensuring `isLoading` is always set back to `false`.

Now integrate this into the table. Remove the placeholder rows from `<tbody>` and replace them with a `map` over the `projects` array:
```tsx
<tbody>
    {projects.map((project) => (
        <tr key={project.id} className={styles.row}>
            <td className={styles.cell}>{project.id}</td>
            <td className={styles.cell}>{project.project_name}</td>
            <td className={styles.cell}>
                {/* to fill out */}
            </td>
            <td className={styles.cell}>
                {/* to fill out */}
            </td>
            <td className={styles.cell}>{project.project_description}</td>
        </tr>
    ))}
</tbody>
```

The manager and associate columns are left blank intentionally — they need extra logic because we stored IDs, not names. For the manager, use the `usernamesById` map with a fallback:
```tsx
<td className={styles.cell}>
    {usernamesById[project.project_manager_id] ?? `User ${project.project_manager_id}`}
</td>
```

The `??` (nullish coalescing) operator returns the right side if the left side is `null` or `undefined` — so if the username isn't in the map, it falls back to `"User <id>"`.

For associates, first check if the list is empty, then map each ID to a name:
```tsx
<td className={styles.cell}>
    {(associatesByProjectId[project.id] ?? []).length === 0
        ? "None"
        : (associatesByProjectId[project.id] ?? [])
                .map((associateId) => usernamesById[associateId] ?? `User ${associateId}`)
                .join(", ")}
</td>
```

If the project has no associates, display "None". Otherwise, resolve each associate ID to a username and join them with a comma.

Finally, add early returns to handle loading and error states. Place these after your hook declarations but before the main JSX return:
```tsx
if (isLoading) {
    return <p>Loading projects...</p>;
}

if (error) {
    return <p className={styles.error}>{error}</p>;
}

if (projects.length === 0) {
    return <p>No projects found.</p>;
}
```

At this point, your project display component should be fully functional. Now it's your turn: in `/projects/page.tsx`, build out the `AddProjectForm` and `AssignUserToProjectForm` components using what you've learned here.

Once all three components are working, you have completed the primer. Submit your work to Sweekrit and Nikitha for review — congratulations!