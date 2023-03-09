import { useContext } from "react";
import { TeamsFxContext } from "./Context";
import { PortalPage } from "./videoportal/PortalPage";

export default function Tab() {
  const { themeString } = useContext(TeamsFxContext);
  return (
    <div className={themeString === "default" ? "" : "dark"}>
      <PortalPage />
    </div>
  );
}
