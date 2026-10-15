# Stitch MCP retrieval

Status: Read-only calls succeeded and returned results. A screenshot of the successful call UI is still pending.

## Host, client, and server

- **Host application:** Codex desktop, where the user requested retrieval.
- **Client:** The MCP client within Codex sends structured tool requests and receives results.
- **Server:** The connected Stitch MCP server exposes project, screen, and design-system operations and returns Stitch data. The dashboard itself does not require MCP integration.

## Tool inspection

Available Stitch tool metadata was inspected before calling the server. It exposes `list_projects`, `get_project`, `list_screens`, `get_screen`, and `list_design_systems`, plus creation, editing, and deletion tools. Full discovered names are recorded in the evidence file. No generic `get_design_context` or current-selection tool was exposed. No write operations were called.

## Actual calls and returned results

| Actual tool | Request | Result |
| --- | --- | --- |
| `mcp__stitch__list_projects` | `{}`; list owned projects using the default filter. | Five projects. Matched **Asta Preparation Dashboard**, `projects/2928567958381260943`, also matching the URL in the supplied screenshots. |
| `mcp__stitch__get_project` | `{"name":"projects/2928567958381260943"}` | Private project metadata, theme, design Markdown, colour tokens, typography, spacing, and canvas instances. |
| `mcp__stitch__list_screens` | `{"projectId":"2928567958381260943"}` | Seven screens: original desktop/mobile, refined desktop/mobile, and three reference images. Four dashboard screens include HTML and screenshot links. |
| `mcp__stitch__list_design_systems` | `{"projectId":"2928567958381260943"}` | One design system: **Anti-Magic Grimoire**, version 1, with tokens and component/style guidelines. |
| `mcp__stitch__get_screen` | `{"name":"projects/2928567958381260943/screens/9ada80764aa84ab5a2bc41d93613c0b3"}` | **Asta’s Preparation Dashboard - Refined Desktop**, DESKTOP, reported size 2560 × 2048; HTML and screenshot links returned. |
| `mcp__stitch__get_screen` | `{"name":"projects/2928567958381260943/screens/1e096b042ba44674bde5467a90eebb05"}` | **Asta’s Preparation Dashboard - Refined Mobile**, MOBILE, reported size 780 × 1768; HTML and screenshot links returned. |

## Retrieved design context

- Dark theme, custom crimson `#ff3b30`, dark surface `#111317`, and amber/gold accents. Some structured colour tokens differ from the descriptive guidelines.
- Saved fonts: **Space Grotesk** for headings/labels and **Plus Jakarta Sans** for body text. These differ from the earlier local recommendation of Barlow Condensed and Inter.
- Typography includes 48px desktop display text, 32px mobile display text, 16px body text, and smaller 10–14px variants.
- Spacing includes 4px, 8px, 16px, 24px, and 40px steps, 2rem desktop margins, and 1rem mobile margins. Base roundness is 4px, with larger card radii in the guidelines.
- Guidelines describe checkboxes, focus rings, badges, cards, and progress bars. These do not prove implemented behaviour or accessible contrast.
- Refined canvas instances are 1280 × 1024 desktop and 390 × 884 mobile. Screen detail dimensions are twice those sizes; the response does not explain the scaling.

## Missing information and limits

- Live canvas selection is not exposed. The refined pair was retrieved based on its titles and consistency with the latest supplied mockup; the exact selected-screen ID remains unconfirmed.
- HTML and screenshot URLs were returned, but their contents were not downloaded or inspected. Exact per-screen styling and working interactions remain unverified.
- The saved Stitch theme and local design recommendations need reconciliation before implementation. Generic design-system guidance does not expand the PRD scope.
- Keyboard behaviour, screen-reader announcements, contrast, progress calculations, and the 320px layout still need testing in an implementation.

## Evidence

- Sanitized actual call record (historical evidence retained in Git history): requests and returned context, with credentials, authentication headers, asset download URLs, and other projects’ details omitted.
- [Latest supplied mockup](evidence/stitch-design-updated.png): visual reference only, not evidence of an MCP call.
- User-supplied screenshots of the sanitized saved call record in VS Code (no credentials are visible):
  - [Project-list request and result](evidence/stitch-mcp-record-project-list.png), source Screenshot (29).png: shows the actual recorded tool name, empty input, five returned projects, and matched Asta project.
  - Project metadata and theme (historical evidence retained in Git history), source Screenshot (30).png: shows project identity, dark mode, body font, and custom colour.
  - Heading fonts and colour tokens (historical evidence retained in Git history), source Screenshot (31).png: shows saved heading/label fonts and named colours.
- These images document the saved results, not a live tool execution or native MCP call UI. VS Code is the viewer in these screenshots; it was not the host that made the recorded calls.
- **Successful-call screenshot: pending.** Available tools cannot capture the native Codex call UI in this session. Capture an expanded successful Stitch call showing the tool name, request, and returned result, with credentials hidden, then save it under `docs/evidence/` and link it here. No call screenshot has been fabricated or replaced by a mockup.

## MVP design-context retrieval (16 October 2026)

Called `mcp__stitch__get_screen` again for the same refined desktop and mobile IDs recorded above. Both returned successful screen metadata and HTML/screenshot URLs. Their HTML exports were downloaded and inspected; this supersedes the earlier statement that no HTML contents had been inspected. No new design generation or write tool was used. Exports are temporary inspection files under ignored `output/playwright/`; the app uses local code, local supplied artwork, and self-hosted fonts rather than Stitch CDN scripts or remote image replacements. The selected pair follows the latest supplied mockup; live canvas selection is still not exposed by the server.
