import { getGraphItemUrlFromSpoApiUrl } from "../utils/sputils";

// Info gotten from a playlist item thumbnail field
export class ThumbnailUrlGraphInfo {

    listItemGraphUrl: string;
    thumbnailUrl: string;
    get listItemGraphUrlRelative() { return this.listItemGraphUrl.replace("https://graph.microsoft.com/v1.0", "") };

    constructor(listItemGraphUrl: string, thumbnailUrl: string) {
        this.listItemGraphUrl = listItemGraphUrl;
        this.thumbnailUrl = thumbnailUrl;
    }

    // Example thumbnail URL on a playlist item: https://contoso.sharepoint.com/_api/v2.0/drives/b!4ssZhlJsDkqydQo9Adc0xDpzNsyFwftAolttlcBPBajqHKl8guEiRYQnzjHqxsp3/items/01UVLXBBVBSBBYN2J5GNGYTFS6BBUCFVYS/thumbnails/0/c90x150/content?prefer=noredirect%2Cclosestavailablesize&cb=%22%7B864390A1%2D3DE9%2D4D33%2D8996%2D5E086822D712%7D%2C2%22
    public static FromSPListItemThumbnailUrl(url: string): ThumbnailUrlGraphInfo | null {
        if (!url && typeof (url) !== "string") {
            return null;
        }

        const gUrl = getGraphItemUrlFromSpoApiUrl(url);
        if (gUrl && gUrl.length > 0) {
            return new ThumbnailUrlGraphInfo(gUrl, url);
        }

        return null;
    }

}
