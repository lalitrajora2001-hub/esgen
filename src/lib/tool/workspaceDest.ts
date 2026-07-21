/** Which workspace the user picked on sign-in (Manufacturing/ESG vs Events). */
export function workspaceHomePath(): string {
  try {
    return localStorage.getItem("esgen-workspace") === "events" ? "/app/events" : "/app/brsr";
  } catch {
    return "/app/brsr";
  }
}
