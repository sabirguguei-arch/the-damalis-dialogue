import { requestYouTubeRevalidation } from "../../lib/youtube-revalidation.ts";

export default async function youtubeSync() {
  const siteUrl = process.env.URL ?? process.env.SITE_URL;
  const secret = process.env.YOUTUBE_SYNC_SECRET;
  const result = await requestYouTubeRevalidation(siteUrl, secret);

  if (result.ok) {
    console.log(`YouTube cache revalidation requested (${result.status}).`);
    return;
  }

  if (result.reason === "http-error") {
    console.error(`YouTube cache revalidation failed with HTTP ${result.status}.`);
    return;
  }

  console.error(`YouTube cache revalidation skipped: ${result.reason}.`);
}

export const config = {
  schedule: "@hourly",
};
