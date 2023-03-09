import { ListItem } from "@microsoft/microsoft-graph-types";
import { AbstractVideoLoader } from "../loaders/VideoLoaders";
import { getSiteUrl, getSPItemFieldValue } from "../utils/sputils";
import { SPItemInfo } from "./SPItemInfo";
import { ThumbnailUrlGraphInfo } from "./ThumbnailUrlGraphInfo";

export class VideoInfo {

    uniqueId: string;
    siteUrl: string;

    // Construct from either SPItemInfo or base params
    constructor(i: SPItemInfo | undefined, uniqueId: string | undefined, siteUrl: string | undefined) {
        if (i) {
            this.uniqueId = i.etag.id;

            const u = getSiteUrl(i.webUrl);
            if (u) {
                this.siteUrl = u;
            }
            else
                throw new Error("Invalid video info");
        }
        else {
            if (siteUrl && uniqueId) {

                this.uniqueId = uniqueId;
                this.siteUrl = siteUrl;
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

    public static FromVideoSPListItem(spListItem: ListItem): Promise<VideoInfo> {

        const inf = SPItemInfo.FromListItem(spListItem);
        if (inf) {
            return Promise.resolve(new VideoInfo(inf, undefined, undefined));
        }
        return Promise.reject("Invalid video ListItem");
    }
}
