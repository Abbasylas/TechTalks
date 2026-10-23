# Stitch MCP retrieval

## Summary

- **Why Stitch was used:** To read the reviewed dashboard design before building it.
- **What came back:** `mcp__stitch__get_screen` returned **Asta’s Preparation Dashboard - Refined Desktop**, marked **DESKTOP**, with dimensions of **2560 × 2048** and links to its HTML and screenshot.
- **Where to see it:** [Expanded call result](evidence/stitch-native-call.png), [HTML result continuation](evidence/stitch-native-call-html.png), and the [saved request and result](evidence/stitch-successful-call.json).
- **Status:** The call succeeded, and screenshots of the result are included below.

## The successful call

Request:

```json
{"name":"projects/2928567958381260943/screens/9ada80764aa84ab5a2bc41d93613c0b3"}
```

Stitch returned the requested screen with the title, size, device type, and asset links described above. The [saved result](evidence/stitch-successful-call.json) keeps the file identifiers but leaves out download URLs. This call only read the design; it did not change it.

## Host, client, and server

- **Host:** Codex desktop is where the original retrieval was requested.
- **Client:** Codex’s MCP client sends the request and receives the reply.
- **Server:** Google Stitch provides the tools that return project, screen, and design-system information. The finished dashboard runs without an MCP connection.

## Historical tool inspection and calls

Before the original calls, the available Stitch tools were checked. They included `list_projects`, `get_project`, `list_screens`, `get_screen`, and `list_design_systems`, along with tools for making changes. Their full names are in the [saved call record](https://github.com/Abbasylas/TechTalks/blob/4d58a918fe1ddf46fedefc9e0ffae382bf318eb4/docs/evidence/stitch-mcp-call-record.json). There was no `get_design_context` tool or way to read the current canvas selection. Only read operations were used to retrieve the design.

## Calls and what they returned

| Tool | Request | What it returned |
| --- | --- | --- |
| `mcp__stitch__list_projects` | `{}`; list owned projects using the default filter. | Five projects. Matched **Asta Preparation Dashboard**, `projects/2928567958381260943`, also matching the URL in the supplied screenshots. |
| `mcp__stitch__get_project` | `{"name":"projects/2928567958381260943"}` | Private project metadata, theme, design Markdown, colour tokens, typography, spacing, and canvas instances. |
| `mcp__stitch__list_screens` | `{"projectId":"2928567958381260943"}` | Seven screens: original desktop/mobile, refined desktop/mobile, and three reference images. Four dashboard screens include HTML and screenshot links. |
| `mcp__stitch__list_design_systems` | `{"projectId":"2928567958381260943"}` | One design system: **Anti-Magic Grimoire**, version 1, with tokens and component/style guidelines. |
| `mcp__stitch__get_screen` | `{"name":"projects/2928567958381260943/screens/9ada80764aa84ab5a2bc41d93613c0b3"}` | **Asta’s Preparation Dashboard - Refined Desktop**, DESKTOP, reported size 2560 × 2048; HTML and screenshot links returned. |
| `mcp__stitch__get_screen` | `{"name":"projects/2928567958381260943/screens/1e096b042ba44674bde5467a90eebb05"}` | **Asta’s Preparation Dashboard - Refined Mobile**, MOBILE, reported size 780 × 1768; HTML and screenshot links returned. |

## Retrieved design context

- A dark theme with crimson `#ff3b30`, surface colour `#111317`, and amber or gold accents. Some colour tokens differed from the written style notes.
- **Space Grotesk** for headings and labels, and **Plus Jakarta Sans** for body text. These replaced the earlier Barlow Condensed and Inter suggestion.
- Large text at 48px on desktop and 32px on mobile, with 16px body text and smaller sizes from 10–14px.
- Spacing steps of 4px, 8px, 16px, 24px, and 40px; margins of 2rem on desktop and 1rem on mobile. The base corner radius was 4px, with larger corners suggested for cards.
- Notes for checkboxes, focus rings, badges, cards, and progress bars. These were design guidance; behaviour and contrast still needed browser checks.
- Canvas sizes of 1280 × 1024 for desktop and 390 × 884 for mobile. The screen responses reported twice those dimensions without explaining why.

## Historical retrieval limits

- Stitch did not expose the live canvas selection. The refined screens were chosen by their titles and match to the supplied mockup, so the exact screen selected on the canvas was not confirmed.
- The first retrieval returned HTML and screenshot links without opening their contents. The later MVP retrieval included an HTML review.
- The returned theme was used alongside the agreed requirements, as explained in [DESIGN.md](DESIGN.md).
- Keyboard use, contrast, progress, and mobile layout were checked in the app. See [REVIEW.md](REVIEW.md). Spoken screen-reader output still needs testing.

## Evidence

- [Saved call record](https://github.com/Abbasylas/TechTalks/blob/4d58a918fe1ddf46fedefc9e0ffae382bf318eb4/docs/evidence/stitch-mcp-call-record.json): a summary of the requests and returned data. Credentials, authentication headers, download URLs, and other projects’ details were left out.
- [Reviewed mockup](evidence/stitch-design-updated.png): shows the design used as a reference.
- The owner also supplied screenshots of the saved record open in VS Code, with no credentials visible:
  - [Project-list request and result](evidence/stitch-mcp-record-project-list.png), source Screenshot (29).png: shows the actual recorded tool name, empty input, five returned projects, and matched Asta project.
  - [Project metadata and theme](https://github.com/Abbasylas/TechTalks/blob/4d58a918fe1ddf46fedefc9e0ffae382bf318eb4/docs/evidence/stitch-mcp-record-project-theme.png), source Screenshot (30).png: shows project identity, dark mode, body font, and custom colour.
  - [Heading fonts and colour tokens](https://github.com/Abbasylas/TechTalks/blob/4d58a918fe1ddf46fedefc9e0ffae382bf318eb4/docs/evidence/stitch-mcp-record-colour-tokens.png), source Screenshot (31).png: shows saved heading/label fonts and named colours.
- Those VS Code images show the saved results. The native call screenshots below show the tool result in the chat itself.

## Native call screenshots

- [Native call result](evidence/stitch-native-call.png), supplied as Screenshot (34).png: the expanded “Get screen” result in the chat, showing the screen ID, refined desktop title, and screenshot link.
- [HTML result continuation](evidence/stitch-native-call-html.png), supplied as Screenshot (35).png: the same result, scrolled down to show the HTML file ID and download link.

Both images are kept as supplied. They show parts of the successful response. The request and remaining metadata, including dimensions, are in the [saved call record](evidence/stitch-successful-call.json). The older VS Code images are still available for reference.

## MVP design-context retrieval (16 October 2026)

The same refined desktop and mobile screens were retrieved again with `mcp__stitch__get_screen`. Both calls succeeded. This time, the HTML exports were downloaded and reviewed, completing the step that had been left open in the first retrieval. The exports are temporary files in the ignored `output/playwright/` folder. The app uses local code, artwork, and fonts rather than loading Stitch scripts or remote replacements. The screens matched the supplied mockup, although Stitch still did not expose the current canvas selection.

## Direct GitHub history

- [POC and original saved MCP evidence](https://github.com/Abbasylas/TechTalks/commit/0901dc329dd632c114d1499077ecea49909b111c).
- [MVP implementation and updated retrieval account](https://github.com/Abbasylas/TechTalks/commit/4d58a918fe1ddf46fedefc9e0ffae382bf318eb4).
- [Evidence cleanup](https://github.com/Abbasylas/TechTalks/commit/a07de867d7e531df4e0035799da94d9fce731a2e), which removed repeated files from the folder while keeping them in Git history.
