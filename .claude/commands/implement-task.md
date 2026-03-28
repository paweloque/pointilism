Implement task number $ARGUMENTS from the plan.

Follow these steps in order:

## 1. Read the task

Read the task file at `plan/tasks/$ARGUMENTS` (e.g. `plan/tasks/01-project-scaffold.md`). If the argument is just a number like `01`, find the matching file that starts with that number. Understand the deliverables and acceptance criteria.

## 2. Read the referenced specs

The task file lists which specs it depends on (Phase, Spec fields). Read each referenced spec from `specs/`. Also read `CLAUDE.md` for project rules and `specs/ux-styleguide.md` if the task involves any UI work.

## 3. Analyze current code

Read the existing source files that this task will modify or build upon. Understand what already exists so you build on it correctly. Check `plan/done/` to understand what has already been implemented.

## 4. Implement

Write the code to fulfill the task's deliverables. Follow the specs exactly. After implementation, verify the acceptance criteria are met. If a criterion requires visual or runtime verification, note it for the user.

## 5. Move task to done

Move the task file from `plan/tasks/` to `plan/done/`:
```
git mv plan/tasks/<task-file> plan/done/<task-file>
```

## 6. Commit

Stage all changed files and create a git commit. The commit message should reference the task number and summarize what was implemented. Use this format:

```
task <number>: <short summary>

<bullet points of what was done>
```
