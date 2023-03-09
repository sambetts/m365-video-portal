import { ListItem } from "@microsoft/microsoft-graph-types";
import { getSPItemFieldValue } from "../utils/sputils";
import { EtagInfo } from "./EtagInfo";


export class SPItemInfo {
    etag: EtagInfo;
    webUrl: string;
    constructor(webUrl: string, etag: EtagInfo) {
        this.etag = etag;
        this.webUrl = webUrl;
    }

    // Example: "864390a1-3de9-4d33-8996-5e086822d712,2"
    public static FromListItem(li: ListItem): SPItemInfo | null {
        if (li && li.fields) {

            // Do we have an eTag field to grab the UID from? 
            const eTagFieldVal: string | null = getSPItemFieldValue(li.fields, "@odata.etag");
            let e = null;
            if (eTagFieldVal) {
                e = EtagInfo.FromEtag(eTagFieldVal);
            }

            // Do we have an eTag field to grab the UID from? 
            if (li.webUrl && e) {
                return new SPItemInfo(li.webUrl, e);
            }
        }

        return null;
    }
}
