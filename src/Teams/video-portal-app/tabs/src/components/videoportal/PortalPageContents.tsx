
import { TeamsUserCredential } from "@microsoft/teamsfx";
import { useState } from "react";
import { UserLoggedIn } from "./UserLoggedIn";
import { Client } from "@microsoft/microsoft-graph-client";
import { useData } from "@microsoft/teamsfx-react";
import { ListItem } from "@microsoft/microsoft-graph-types";
import { IGraphResponse } from "../../models/GraphResponse";
import { PlaylistInfoSPItemInfo, PlaylistVideoItemInfo } from "../../models/SPListItemWrappersClasses";
import { PlaylistBrowser } from "./controls/PlaylistBrowser";
import { VideoIframe } from "./controls/VideoIframe";
import { Button } from "@fluentui/react-northstar";

export function PortalPageContents(props: { teamsUserCredential: TeamsUserCredential, graphClient: Client }) {

  const PLAYLISTS_LISTTITLE = "PlayLists";
  const [listItems, setListItems] = useState<PlaylistInfoSPItemInfo[] | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<PlaylistVideoItemInfo | null>(null);

  useData(async () => {
    try {

      // Get playlists from a list of what there is & what's published
      const siteId = process.env.REACT_APP_SPSITE_ID;
      const url = `/sites/${siteId}/lists/${PLAYLISTS_LISTTITLE}/items?$expand=fields&$filter=fields/Published+eq+1`;
      const playlistResults: IGraphResponse<ListItem> = await props.graphClient.api(url)
        .header("Prefer", "HonorNonIndexedQueriesWarningMayFailRandomly").get();    // fields/Published isn't indexed. List is small so it's fine.

      const playLists: PlaylistInfoSPItemInfo[] = [];
      playlistResults.value.forEach(i => {
        playLists.push(new PlaylistInfoSPItemInfo(i));
      });
      setListItems(playLists);

    } catch (err: unknown) {
      console.error(err);
    }

    return;
  });
  return (
    <div>
      <>
        <UserLoggedIn graphClient={props.graphClient} />
        {selectedVideo &&
          <div>
            <VideoIframe siteRootUrl={selectedVideo.rootSiteUrl} title="{selectedVideo}" videoUniqueId={selectedVideo.etag.id} autoPlay={true} />
            <div>
              <Button content="Close" onClick={() => setSelectedVideo(null)} />
            </div>
          </div>
        }
        {listItems ?
          <>
            {listItems.length === 0 ?
              <p>No videos playlists found</p>
              :
              <>
                {listItems.map(l => {
                  return <>
                    <PlaylistBrowser graphClient={props.graphClient} listTitle={l.playListTitle}
                      siteId={process.env.REACT_APP_SPSITE_ID!} onVideoClick={(v: PlaylistVideoItemInfo) => setSelectedVideo(v)} />

                  </>
                })}
              </>
            }
          </>
          :
          <p>Loading...</p>
        }
      </>
    </div >
  );
}
