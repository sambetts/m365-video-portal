
import { TeamsUserCredential, UserInfo } from "@microsoft/teamsfx";
import { useState } from "react";
import { UserLoggedIn } from "./UserLoggedIn";
import { Button } from "@fluentui/react-northstar";
import { Client } from "@microsoft/microsoft-graph-client";
import { useData } from "@microsoft/teamsfx-react";
import { GraphVideoLoader, loadVideosFromPlayListSPListItems } from "../../loaders/VideoLoaders";
import { VideoInfo } from "../../models/VideoInfo";
import { VideoIframe } from "./VideoIframe";

export function PortalPageContents(props: { teamsUserCredential: TeamsUserCredential, graphClient: Client }) {

  const [videos, setVideos] = useState<VideoInfo[] | null>(null);

  // Test a Graph call
  const { loading, data, error } = useData(async () => {
    try {

      // Test client
      const siteId = process.env.REACT_APP_SPSITE_ID;
      const listItems = await props.graphClient.api(`/sites/${siteId}/lists/Playlist/items?expand=fields`).get();

      const videos = await loadVideosFromPlayListSPListItems(listItems.value, new GraphVideoLoader(props.graphClient));
      setVideos(videos);

    } catch (err: unknown) {
      console.error(err);
    }

    return;
  });
  return (
    <div>
      <>
        <UserLoggedIn graphClient={props.graphClient} />
        <p>Videos from a playlist:</p>
        {videos ?
          <>
            {videos.length === 0 ?
              <p>No videos found</p>
              :
              <>
                {videos.map(v => {
                  return <VideoIframe siteRootUrl={v.siteUrl} title="Whatevs" videoUniqueId={v.uniqueId} key={v.uniqueId} />
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
