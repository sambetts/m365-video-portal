import { Client } from "@microsoft/microsoft-graph-client";
import { ListItem } from "@microsoft/microsoft-graph-types";
import { VideoInfo } from "../models/VideoInfo";
import { ThumbnailUrlGraphInfo } from "../models/ThumbnailUrlGraphInfo";

export abstract class AbstractVideoLoader {
    abstract LoadVideoInfo(info: ThumbnailUrlGraphInfo): Promise<VideoInfo>;
}

export class GraphVideoLoader extends AbstractVideoLoader {
    
    graphClient: Client;

    constructor(graphClient: Client) {
        super();
        this.graphClient = graphClient;
    }

    LoadVideoInfo(videoItemInfo: ThumbnailUrlGraphInfo): Promise<VideoInfo> {
        return this.graphClient.api(videoItemInfo.listItemGraphUrlRelative).get()
            .then(li => VideoInfo.FromVideoSPListItem(li));
    }
}

// Load items from a playlist item collection. Each item loads the linked video item in question to get the full metadata
export async function loadVideosFromPlayListSPListItems(spListItems: ListItem[], loader: AbstractVideoLoader): Promise<VideoInfo[]> {

    const loadTasks: Promise<VideoInfo>[] = [];
    const r: VideoInfo[] = [];
    if (spListItems) {
        spListItems.map(i => {
            loadTasks.push(VideoInfo.FromPlayListSPListItem(i, loader));
        });
    }

    await Promise.allSettled(loadTasks).then(results => {
        results.forEach(result => result.status === "fulfilled" ? r.push(result.value) : console.warn("Lookup failed: " + result.reason));
    });

    return Promise.resolve(r);
}
