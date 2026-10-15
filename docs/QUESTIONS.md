1) My PRD made it very clear what i expected from the agent to do, what functions will be needed and what the overall purpose of the website is. This makes it so that the agent does not create any extra functionalities or features without any purpose, and makes it a safer environment to avoid hallucinations.

2) The POC tested the functionality of the tasks function. Whether checking or unchecking boxes provides accurate percentages, whether the data remains handled and saved after refresh or not. It allowed us to have the blueprint which was used later on in the full development. It does not check or prove that combat readiness, or that the user would understand the dashboard without additional help or a different form of design. It also did not prove full accessibility over various devices or browsers.

3)  It is useful despite being small because it perfectly handles the one problem asta was facing, which is managing and sorting his training methods while being able to track his progress.

4) The MCP connection allowed the agent (codex) to be fully able to view my stitch projects and extract the one necessary for this build, it also allowed me to check, review and fix any errors.The returned HTML exports helped inspect the layout and styling. 

5) I corrected the overly complicated first design by removing invented threat assessments, sword-output panels, and extra statistics. I brought the focus back to training tasks and progress, then explicitly requested character cards as supporting context because I liked it from the first design.

6) The app stores the IDs of completed tasks. Checking adds an ID; unchecking removes it. The count comes from those IDs, and progress is calculated as Math.round(completed / 3 × 100). Browser storage preserves completion after refresh. Duplicate or unknown saved IDs are filtered out.

7) I still had to define the specific problem, control the scope in which the agent worked with, checked if the interface was functional, optimal and made logical sense while reviewing the evidence and the code. I also separated working code from a fully valid product ready to be shipped, the agent ran checks for errors and similar ideas, but the final decision on what to change, what to keep, what to fix, remained mine. 