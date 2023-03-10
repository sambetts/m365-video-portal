import { Client } from "@microsoft/microsoft-graph-client";
import { ListItem } from "@microsoft/microsoft-graph-types";
import { PlaylistVideoItemInfo } from "../models/SPListItemWrappersClasses";
import { ThumbnailUrlGraphInfo } from "../models/ThumbnailUrlGraphInfo";
import { getSPItemFieldValue } from "../utils/sputils";

export abstract class AbstractVideoLoader {
    abstract LoadVideoInfo(info: ThumbnailUrlGraphInfo): Promise<PlaylistVideoItemInfo>;
}

export class GraphVideoLoader extends AbstractVideoLoader {
    
    graphClient: Client;

    constructor(graphClient: Client) {
        super();
        this.graphClient = graphClient;
    }

    LoadVideoInfo(videoItemInfo: ThumbnailUrlGraphInfo): Promise<PlaylistVideoItemInfo> {
        const tnUrl = videoItemInfo.thumbnailUrl;
        return this.graphClient.api(videoItemInfo.listItemGraphUrlRelative).get()
            .then(li => new PlaylistVideoItemInfo(li, tnUrl));
    }
}

// Load items from a playlist item collection. Each item loads the linked video item in question to get the full metadata
export async function loadVideosFromPlayListSPListItems(spListItems: ListItem[], loader: AbstractVideoLoader): Promise<PlaylistVideoItemInfo[]> {

    const loadTasks: Promise<PlaylistVideoItemInfo>[] = [];
    const r: PlaylistVideoItemInfo[] = [];
    if (spListItems) {
        spListItems.forEach(i => {
            loadTasks.push(loadVideoFromPlayListSPListItem(i, loader));
        });
    }

    await Promise.allSettled(loadTasks).then(results => {
        results.forEach(result => result.status === "fulfilled" ? r.push(result.value) : console.warn("Lookup failed: " + result.reason));
    });

    return Promise.resolve(r);
}

export async function loadVideoFromPlayListSPListItem(spListItem: ListItem, loader: AbstractVideoLoader): Promise<PlaylistVideoItemInfo> {
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
