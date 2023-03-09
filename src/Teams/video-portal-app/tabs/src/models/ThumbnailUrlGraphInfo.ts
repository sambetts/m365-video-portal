import { AbstractVideoLoader } from "../loaders/VideoLoaders";

export class ThumbnailUrlGraphInfo {

    listItemGraphUrl: string;
    get listItemGraphUrlRelative() { return this.listItemGraphUrl.replace("https://graph.microsoft.com/v1.0", "") };

    constructor(listItemGraphUrl: string) {
        this.listItemGraphUrl = listItemGraphUrl;
    }

    // Example thumbnail URL on a playlist item: https://contoso.sharepoint.com/_api/v2.0/drives/b!4ssZhlJsDkqydQo9Adc0xDpzNsyFwftAolttlcBPBajqHKl8guEiRYQnzjHqxsp3/items/01UVLXBBVBSBBYN2J5GNGYTFS6BBUCFVYS/thumbnails/0/c90x150/content?prefer=noredirect%2Cclosestavailablesize&cb=%22%7B864390A1%2D3DE9%2D4D33%2D8996%2D5E086822D712%7D%2C2%22
    public static FromSPListItemThumbnailUrl(url: string): ThumbnailUrlGraphInfo | null {
        if (!url && typeof (url) !== "string") {
            return null;
        }

        const gUrl = this.getGraphItemUrl(url);
        if (gUrl && gUrl.length > 0) {
            return new ThumbnailUrlGraphInfo(gUrl);
        }

        return null;
    }

    // Get https://contoso.sharepoint.com/_api/v2.0/drives/b!4ssZhlJsDkqydQo9Adc0xDpzNsyFwftAolttlcBPBajqHKl8guEiRYQnzjHqxsp3/items/01UVLXBBVBSBBYN2J5GNGYTFS6BBUCFVYS
    static getGraphItemUrl(url: string): string | null {
        if (url && url.length > 0) {

            const urlParsed = (new URL(url));
            const urlLower = url.toLowerCase();
            const ITEMS = "/items/";
            const itemsLoc = urlLower.indexOf(ITEMS);
            if (itemsLoc > -1) {
                const nextSlashStart = itemsLoc + ITEMS.length;

                const nextSlashLoc = urlLower.indexOf("/", nextSlashStart);
                if (nextSlashLoc > -1) {
                    const itemsSpUrl = url.substring(0, nextSlashLoc) + "/listItem";

                    return itemsSpUrl.replace(urlParsed.hostname + "/_api/v2.0", "graph.microsoft.com/v1.0");
                }
            }
        }

        return null;
    }
}
