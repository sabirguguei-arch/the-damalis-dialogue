import { revalidateTag } from "next/cache";
import { YOUTUBE_EPISODES_CACHE_TAG } from "@/lib/episodes";
import {
  invalidateYouTubeEpisodes,
  isAuthorizedSyncRequest,
} from "@/lib/youtube-revalidation";

export async function POST(request: Request) {
  const configuredSecret = process.env.YOUTUBE_SYNC_SECRET;
  const authorizationHeader = request.headers.get("authorization");

  if (!isAuthorizedSyncRequest(configuredSecret, authorizationHeader)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  invalidateYouTubeEpisodes(revalidateTag, YOUTUBE_EPISODES_CACHE_TAG);

  return Response.json({ ok: true, revalidated: "youtube-episodes" });
}

export async function GET() {
  return Response.json(
    { ok: false, error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}
