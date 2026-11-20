import "server-only";

const repo = process.env.GITHUB_REPO ?? "jorismulkens/travel-monkey";

/**
 * Start een GitHub Actions-workflow via de API. Wordt gebruikt door de
 * Vercel-cron, omdat geplande workflows op GitHub niet betrouwbaar afgaan.
 */
export async function dispatchWorkflow(file: string): Promise<void> {
  const token = process.env.GITHUB_DISPATCH_TOKEN;

  if (!token) {
    throw new Error("GITHUB_DISPATCH_TOKEN ontbreekt");
  }

  const response = await fetch(
    `https://api.github.com/repos/${repo}/actions/workflows/${file}/dispatches`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ref: "main" }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub ${response.status}: ${body.slice(0, 300)}`);
  }
}

export function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;

  if (!secret) return false;

  return request.headers.get("authorization") === `Bearer ${secret}`;
}
