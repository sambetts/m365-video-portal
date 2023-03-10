import { ListItem } from "@microsoft/microsoft-graph-types";
import { getSPItemFieldValue } from "../utils/sputils";
import { EtagInfo } from "./EtagInfo";

export class BaseSPItemInfo {

    id: string;
    etag: EtagInfo;
    webUrl: string;

    constructor(li: ListItem) {
        if (li && li.fields && li.id) {
            this.id = li.id;
            
            // Do we have an eTag field to grab the UID from? 
            const eTagFieldVal: string | null = getSPItemFieldValue(li.fields, "@odata.etag");
            let e = null;
            if (eTagFieldVal) {
                e = EtagInfo.FromEtag(eTagFieldVal);
            }

            if (li.webUrl && e) {
                this.etag = e;
                this.webUrl = li.webUrl;
                return;
            }
        }
        throw new Error("Invalid base ListItem");
    }
}

// An item in a playlist
export class PlaylistVideoItemInfo extends BaseSPItemInfo {

    thumbnail: string;

    constructor(li: ListItem, thumbnail: string) {
        super(li);
        this.thumbnail = thumbnail;
    }
}

// A link to a playlist
export class PlaylistInfoSPItemInfo extends BaseSPItemInfo {

    siteId : string | null;
    playListTitle: string;

    constructor(li: ListItem) {
        super(li)
        if (li.fields) {

            this.siteId = getSPItemFieldValue(li.fields, "SiteId");
            const playListTitleVal: string | null = getSPItemFieldValue(li.fields, "Title");

            if (playListTitleVal) {
                this.playListTitle = playListTitleVal;
                return;
            }
        }
        throw new Error("Invalid PlayListsItemSPItemInfo ListItem");
    }
}
