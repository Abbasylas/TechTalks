# Stitch MCP retrieval

## Summary

- **Purpose:** Retrieve the reviewed dashboard design from Google Stitch for implementation.
- **Successful call:** `mcp__stitch__get_screen` returned **Asta’s Preparation Dashboard - Refined Desktop**, device type **DESKTOP**, size **2560 × 2048**, and HTML/screenshot links.
- **Evidence:** The [new successful-call record](evidence/stitch-successful-call.json) preserves the actual request and returned metadata. Existing screenshots and historical commit links remain below.
- **Status:** The read-only call succeeded in this session. A screenshot of its expanded native call UI is not included; the existing image shows a saved record.

## Successful call in this session

Request:

```json
{"name":"projects/2928567958381260943/screens/9ada80764aa84ab5a2bc41d93613c0b3"}
```

The returned screen name matched the request, with the title, dimensions, device type, and asset links listed above. The [saved result](evidence/stitch-successful-call.json) omits asset download URLs and retains the returned file identifiers. No design was generated or changed.

## Host, client, and server

- **Host application:** Codex desktop, where the user requested retrieval.
- **Client:** The MCP client within Codex sends structured tool requests and receives results.
- **Server:** The connected Stitch MCP server exposes project, screen, and design-system operations and returns Stitch data. The dashboard itself does not require MCP integration.

## Historical tool inspection and calls

The original Stitch tool metadata was inspected before calling the server. It exposed `list_projects`, `get_project`, `list_screens`, `get_screen`, and `list_design_systems`, plus creation, editing, and deletion tools. Full discovered names are preserved in the [sanitized saved call record](https://github.com/Abbasylas/TechTalks/blob/4d58a918fe1ddf46fedefc9e0ffae382bf318eb4/docs/evidence/stitch-mcp-call-record.json). No generic `get_design_context` or current-selection tool was exposed. No write operations were called during retrieval.

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

## Historical retrieval limits

- Live canvas selection is not exposed. The refined pair was retrieved based on its titles and consistency with the latest supplied mockup; the exact selected-screen ID remains unconfirmed.
- At the initial retrieval stage, HTML and screenshot URLs had been returned without inspecting their contents. The later MVP retrieval below included HTML inspection.
- The theme was subsequently reconciled with the implementation as described in [DESIGN.md](DESIGN.md). Generic design-system guidance did not expand the PRD scope.
- Implementation checks for keyboard operation, contrast, progress, and mobile layout are recorded in [REVIEW.md](REVIEW.md). Actual screen-reader speech remains untested.

## Evidence

- [Sanitized saved call record](https://github.com/Abbasylas/TechTalks/blob/4d58a918fe1ddf46fedefc9e0ffae382bf318eb4/docs/evidence/stitch-mcp-call-record.json): requests and returned context, with credentials, authentication headers, asset download URLs, and other projects’ details omitted. It records summaries of returned data, rather than an unmodified server transcript.
- [Latest supplied mockup](evidence/stitch-design-updated.png): visual reference only, not evidence of an MCP call.
- User-supplied screenshots of the sanitized saved call record in VS Code (no credentials are visible):
  - [Project-list request and result](evidence/stitch-mcp-record-project-list.png), source Screenshot (29).png: shows the actual recorded tool name, empty input, five returned projects, and matched Asta project.
  - [Project metadata and theme](https://github.com/Abbasylas/TechTalks/blob/4d58a918fe1ddf46fedefc9e0ffae382bf318eb4/docs/evidence/stitch-mcp-record-project-theme.png), source Screenshot (30).png: shows project identity, dark mode, body font, and custom colour.
  - [Heading fonts and colour tokens](https://github.com/Abbasylas/TechTalks/blob/4d58a918fe1ddf46fedefc9e0ffae382bf318eb4/docs/evidence/stitch-mcp-record-colour-tokens.png), source Screenshot (31).png: shows saved heading/label fonts and named colours.
- These images document the saved results, not a live tool execution or native MCP call UI. VS Code is the viewer in these screenshots; it was not the host that made the recorded calls.

## Screenshot still required

The historical JSON and screenshot match: both show `mcp__stitch__list_projects`, input `{}`, five returned projects, and the matched Asta project. The image shows the saved record in VS Code. The new successful call is recorded above; an expanded native call UI screenshot has not been captured.

To complete the screenshot evidence, capture the successful call above with its tool name, request, and returned result expanded, with credentials hidden. Save it in `docs/evidence/` and link it here.

## MVP design-context retrieval (16 October 2026)

Called `mcp__stitch__get_screen` again for the same refined desktop and mobile IDs recorded above. Both returned successful screen metadata and HTML/screenshot URLs. Their HTML exports were downloaded and inspected; this supersedes the earlier statement that no HTML contents had been inspected. No new design generation or write tool was used. Exports are temporary inspection files under ignored `output/playwright/`; the app uses local code, local supplied artwork, and self-hosted fonts rather than Stitch CDN scripts or remote image replacements. The selected pair follows the latest supplied mockup; live canvas selection is still not exposed by the server.

## Direct GitHub history

- [POC and original saved MCP evidence](https://github.com/Abbasylas/TechTalks/commit/0901dc329dd632c114d1499077ecea49909b111c).
- [MVP implementation and updated retrieval account](https://github.com/Abbasylas/TechTalks/commit/4d58a918fe1ddf46fedefc9e0ffae382bf318eb4).
- [Evidence cleanup](https://github.com/Abbasylas/TechTalks/commit/a07de867d7e531df4e0035799da94d9fce731a2e), which removed redundant local records while preserving them in history.
