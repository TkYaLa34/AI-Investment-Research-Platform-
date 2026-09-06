# Agent Development Guidelines (AGENTS.md)

## 1. Core Mandate
Jules must strictly adhere to the established project specifications (`PRODUCT_SPEC.md`, `ARCHITECTURE.md`, `DATA_MODEL.md`, `AI_SKILLS.md`) before implementing any feature, refactoring code, or adding new modules.

## 2. Development Workflow
1. Create a dedicated feature branch from `main`.
2. Implement code adhering strictly to TypeScript and Next.js best practices.
3. Run tests and verify local builds.
4. Open a Pull Request for review.
5. Merge into `main` to trigger automated Vercel deployment.

## 3. Code Standards
* Write clean, modular, and well-documented code.
* Ensure all database changes are managed through Supabase migrations.
* Maintain strict type safety across all components and AI skills.
