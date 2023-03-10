import { ListItem } from "@microsoft/microsoft-graph-types";
import { AbstractVideoLoader } from "../loaders/VideoLoaders";
import { getSiteUrl, getSPItemFieldValue } from "../utils/sputils";
import { PlayListItemInfo } from "./SPItemInfo";
import { ThumbnailUrlGraphInfo } from "./ThumbnailUrlGraphInfo";

export class VideoInfo {

    uniqueId: string;
    siteUrl: string;
    thumbnail: string;

    // Construct from either SPItemInfo or base params
    constructor(videoListItemInfo: PlayListItemInfo | undefined, uniqueId: string | undefined, siteUrl: string | undefined, thumbnail: string | undefined) {
        if (videoListItemInfo) {
            this.uniqueId = videoListItemInfo.etag.id;
            this.thumbnail = videoListItemInfo.thumbnail;

            const u = getSiteUrl(videoListItemInfo.webUrl);
            if (u) {
                this.siteUrl = u;
            }
            else
                throw new Error("Invalid video info");
        }
        else {
            if (siteUrl && uniqueId && thumbnail) {

                this.uniqueId = uniqueId;
                this.siteUrl = siteUrl;
                this.thumbnail = thumbnail;
            }
            else
                throw new Error("Invalid video info");
        }
    }

    public static async FromPlayListSPListItem(spListItem: ListItem, loader: AbstractVideoLoader): Promise<VideoInfo> {
        if (spListItem && spListItem.fields) {

            // Do we have a thumbnail field? 
            const thumbnailFieldVal: string | null = getSPItemFieldValue(spListItem.fields, "Thumbnail");
            if (thumbnailFieldVal) {
                const videoItemInfo = await ThumbnailUrlGraphInfo.FromSPListItemThumbnailUrl(thumbnailFieldVal);
                if (videoItemInfo) {
                    try {
                        // Try loading the item info
                        return await loader.LoadVideoInfo(videoItemInfo);
                    } catch (error) {
                        return Promise.reject(error);
                    }
                }
            }
        }
        return Promise.reject("Invalid playlist ListItem");
    }

    public static FromVideoSPListItem(spListItem: ListItem, thumbnail: string): Promise<VideoInfo> {

        const inf = new PlayListItemInfo(spListItem, thumbnail);
        if (inf) {
            return Promise.resolve(new VideoInfo(inf, undefined, undefined, undefined));
        }
        return Promise.reject("Invalid video ListItem");
    }
}
