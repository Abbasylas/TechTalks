# Job Hunt Tracker

**Developer:** Abbas Al Shab  
**Description:** A lightweight Next.js application designed to track yahya's 2-month career preparation plan. It follows learning milestones, explores open positions for jobs, and offers a dashbord to keep everything organized

## Getting Started Locally

Follow these quick sequential steps to run this application environment on your machine:

1. **Clone or open the project folder** inside your terminal workspace.
2. **Install the required packages** by running:
   ```bash
   npm install
   ```
3. **Boot up the local Next.js development server**:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to: **`http://localhost:3000`**

Question 2: In newer versions of next.js, params are treated as asynchronous promises instead of synchronous objects. using await ensures that no code is executed before ensuring that the URL routing details are fully functional and ready to be safely read.

Question 2: Keeping the number as a string prevents type missmatch errors and causes less confusion when adding symbols or signs.

Question 3: • Dashboard Layout (layout.tsx): This focuses on the overall visual look and interactivity of the dashboard, it sets the sidebar, design, organization and background boxes. It uses a {children} placeholder slot so content updates inside it without having to reload or cause any disturbances.

• Dashboard Pages (page.tsx): This page handels the data content which is responsible to go to a specific page or component such as the application page and the overview page.