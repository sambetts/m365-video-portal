import { Client } from "@microsoft/microsoft-graph-client";
import { ListItem } from "@microsoft/microsoft-graph-types";
import { useData } from "@microsoft/teamsfx-react";
import { useState } from "react";
import { loadVideosFromPlayListSPListItems, GraphVideoLoader } from "../../../loaders/VideoLoaders";
import { IGraphResponse } from "../../../models/GraphResponse";
import { PlaylistVideoItemInfo } from "../../../models/SPListItemWrappersClasses";
import { VideoThumbnail } from "./VideoThumbnail";

export function PlaylistBrowser(props: { listTitle: string, siteId: string, graphClient: Client, onVideoClick: Function}) {

  const [videos, setVideos] = useState<PlaylistVideoItemInfo[] | null>(null);

  const { error } = useData(async () => {
    try {

      const listItems : IGraphResponse<ListItem> = await props.graphClient.api(`/sites/${props.siteId}/lists/${props.listTitle}/items?$expand=fields`).get();

      const videos = await loadVideosFromPlayListSPListItems(listItems.value, new GraphVideoLoader(props.graphClient));
      setVideos(videos);

    } catch (err: unknown) {
      console.error(err);
    }

    return;
  });
  return (
    <div>
      <h3>{props.listTitle}</h3>
      {error &&
        <div>{JSON.stringify(error)}</div>
      }
      {videos == null ?
        <p>Loading...</p>
        :
        <>
          {videos.map(v => {
            return <VideoThumbnail key={v.etag.id} info={v} onclick={(v : PlaylistVideoItemInfo) => props.onVideoClick(v)} />
          })}
        </>
      }
    </div>
  );
}

