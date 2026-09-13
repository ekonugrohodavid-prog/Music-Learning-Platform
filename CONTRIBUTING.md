# Contributing

## Branching Strategy

The repository uses a simple branching model:

- `main` — always deployable.
- `feature/*` — development branches for individual backlog tasks or focused changes.

## Workflow

1. Start from the latest `main`.
2. Create a focused `feature/*` branch.
3. Implement one backlog item or small related increment.
4. Run the required verification locally.
5. Commit with a small, descriptive message.
6. Merge into `main` only after verification passes.

## Commit Strategy

Commits should be small and measurable. Prefer messages such as:

- `feat: add music event model`
- `feat: add rhythm grid`
- `feat: add activity submission`
- `fix: validate measure duration`

Do not combine unrelated backlog items in one commit.
