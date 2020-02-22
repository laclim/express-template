import { google } from "googleapis";
const compute = google.compute("v1");

async function main() {
  // This method looks for the GCLOUD_PROJECT and GOOGLE_APPLICATION_CREDENTIALS
  // environment variables.
  const auth = new google.auth.GoogleAuth({
    // Scopes can be specified either as an array or as a single, space-delimited string.
    scopes: ["https://www.googleapis.com/auth/compute"]
  });
  const authClient = await auth.getClient();

  // obtain the current project Id
  const project = await auth.getProjectId();

  // Fetch the list of GCE zones within a project.
  const res = await compute.zones.list({ project, auth: authClient });
  console.log(res.data);
}

main().catch(console.error);
