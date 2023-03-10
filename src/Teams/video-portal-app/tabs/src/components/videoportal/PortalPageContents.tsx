
import { TeamsUserCredential, UserInfo } from "@microsoft/teamsfx";
import { useState } from "react";
import { UserLoggedIn } from "./UserLoggedIn";
import { Client } from "@microsoft/microsoft-graph-client";
import { useData } from "@microsoft/teamsfx-react";
import { List, ListItem } from "@microsoft/microsoft-graph-types";
import { IGraphResponse } from "../../models/GraphResponse";
import { PlayListItemInfo, PlayListsItemSPItemInfo } from "../../models/SPItemInfo";

export function PortalPageContents(props: { teamsUserCredential: TeamsUserCredential, graphClient: Client }) {

  const PLAYLISTS_LISTTITLE = "PlayLists";
  const [listItems, setListItems] = useState<ListItem[] | null>(null);

  // Test a Graph call
  const { loading, data, error } = useData(async () => {
    try {

      // Test client
      const siteId = process.env.REACT_APP_SPSITE_ID;
      const playlistResults: IGraphResponse<ListItem> = await props.graphClient.api(`/sites/${siteId}/lists/${PLAYLISTS_LISTTITLE}/items?$expand=fields`).get();

      const playLists : PlayListsItemSPItemInfo[] = [];
      playlistResults.value.forEach(i=> 
        {
          playLists.push(new PlayListsItemSPItemInfo(i));
        });
      setListItems(playlistResults.value);

    } catch (err: unknown) {
      console.error(err);
    }

    return;
  });
  return (
    <div>
      <>
        <UserLoggedIn graphClient={props.graphClient} />
        {listItems ?
          <>
            {listItems.length === 0 ?
              <p>No videos playlists found</p>
              :
              <>
                {listItems.map(l => {
                  return <>
                    <p key={l.id}>{l.name}</p>

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
