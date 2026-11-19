<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

<!-- AGENT-MEMORY:BEGIN -->
## Architecture
- App state (session, moods, check-ins, chat, settings) lives in `src/context/NearContext.tsx`, persisted to localStorage key `near:v1` and loaded after hydration — prototype has no backend; keep the context API stable so a FastAPI/MongoDB backend can replace it later.
- Content, copy and seed data live in `src/services/mockData.ts`; pure rules (crisis detection, streak, companion replies) live in `src/services/*.ts` with tests in `src/services/near-rules.test.ts` — keeps logic testable and swappable.
- Signed-in screens wrap their content in `AppScreen` (`src/components/near/AppScreen.tsx`), which guards session/onboarding client-side and renders the sticky emergency banner + bottom nav — one place for the auth/layout contract.
- Crisis phrases must always short-circuit normal replies and show `SafetyCard` with the official lines — safety beats conversation flow.
- Ambient sounds are synthesized with Web Audio (`src/hooks/useAmbientSound.ts`) and voice uses the browser Web Speech API with a demo fallback — no audio files or external services needed.
- The mobile frame (max-w-md column) is set once in `src/routes/__root.tsx`; fixed/sticky UI must stay inside that column.
<!-- AGENT-MEMORY:END -->
