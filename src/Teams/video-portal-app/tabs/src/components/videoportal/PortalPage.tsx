import { useContext, useState } from "react";
import { Image } from "@fluentui/react-northstar";
import { TeamsFxContext } from "../Context";
import { Client } from "@microsoft/microsoft-graph-client";
import { SCOPES } from "../../constants";
import { PortalPageContents } from "./PortalPageContents";
import { GraphContainer } from "../common/GraphContainer";

export function PortalPage() {

  const { teamsUserCredential } = useContext(TeamsFxContext);
  const [graphClient, setGraphClient] = useState<Client | null>(null);

  return (
    <div className="welcome page">
      <div className="narrow page-padding">
        <h1 className="center">Super Awesome Video Portal</h1>

        <GraphContainer scopes={SCOPES} onGraphClientValidated={(c: Client)=> setGraphClient(c)}>

          {graphClient ?
            <PortalPageContents teamsUserCredential={teamsUserCredential!} graphClient={graphClient} />
            :
            <p>Oops. We have auth but no Graph client? Reload app maybe?</p>
          }

        </GraphContainer>

      </div>
    </div>
  );
}
