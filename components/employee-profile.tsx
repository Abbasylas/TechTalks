import { ApiError, EMPLOYEE_ID, type Employee } from "@/lib/api";

// No "use client" here: the employee request stays on the server.
export default async function EmployeeProfile() {
  // Keep the parsed data typed before using its fields.
  let employee: Employee;
  try {
    // This request runs on the server, when the profile renders.
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${EMPLOYEE_ID}`,
      { cache: "no-store", signal: AbortSignal.timeout(15000) },
    );

    // fetch still resolves for HTTP errors, so check the status first.
    if (!response.ok) {
      throw new ApiError("The employee profile request failed.", response.status);
    }

    // Parse the response body; a parsing failure also reaches the catch below.
    employee = (await response.json()) as Employee;
  } catch {
    // Only this section changes if the profile can't load.
    return (
      <p role="alert" className="error">
        We couldn’t load the contributor profile. Please refresh the page to try again.
      </p>
    );
  }
  const initials = employee.name.split(" ").map((part) => part[0]).slice(0, 2).join("");
  return (
    <div className="profile-content">
      <div className="avatar" aria-hidden="true">{initials}</div>
      <h3>{employee.name}</h3>
      <p className="employee-label">Demo contributor 01</p>
      <dl>
        <div><dt>Email</dt><dd><a href={`mailto:${employee.email}`}>{employee.email}</a></dd></div>
        <div><dt>Company</dt><dd>{employee.company.name}</dd></div>
      </dl>
    </div>
  );
}
