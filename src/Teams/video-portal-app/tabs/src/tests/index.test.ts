import { FieldValueSet, ListItem } from "@microsoft/microsoft-graph-types";
import { AbstractVideoLoader, loadVideosFromPlayListSPListItems } from "../loaders/VideoLoaders";
import { EtagInfo } from "../models/EtagInfo";
import { PlaylistVideoItemInfo } from "../models/SPListItemWrappersClasses";
import { ThumbnailUrlGraphInfo } from "../models/ThumbnailUrlGraphInfo";

class TestAbstractVideoLoader extends AbstractVideoLoader
{
  LoadVideoInfo(info: ThumbnailUrlGraphInfo): Promise<PlaylistVideoItemInfo> {
    
    const fields : TestFieldValueSet = 
    {
      id:"1",
      Title: "",
      "fields@odata.context": "asdfasdfa"
    }
    const spListItem : ListItem = { id: "1", fields: fields };
    const testVid = new PlaylistVideoItemInfo(spListItem, "https://whatevr/thumbnail");
    return Promise.resolve(testVid);
  }
}
const testLoader = new TestAbstractVideoLoader();

describe('Model tests', () => {
  test('VideoList.FromPlayListSPListItems', () => {

    const fields : TestFieldValueSet = 
    {
      id:"1",
      Thumbnail: "https://contoso.sharepoint.com/_api/v2.0/drives/b!4ssZhlJsDkqydQo9Adc0xDpzNsyFwftAolttlcBPBajqHKl8guEiRYQnzjHqxsp3/items/01UVLXBBVBSBBYN2J5GNGYTFS6BBUCFVYS/thumbnails/0/c90x150/content?prefer=noredirect%2Cclosestavailablesize&cb=%22%7B864390A1%2D3DE9%2D4D33%2D8996%2D5E086822D712%7D%2C2%22",
      Title: "",
      "fields@odata.context": "asdfasdfa"
    }
    const spListItem : ListItem = { id: "1", fields: fields };

    loadVideosFromPlayListSPListItems([spListItem], testLoader).then(r => expect(r.length === 1).toBeTruthy());

  });
  test('EtagInfo', () => {

    expect(EtagInfo.FromEtag("")).toBeNull();
    expect(EtagInfo.FromEtag("")).toBeNull();

    const t = EtagInfo.FromEtag("\"864390a1-3de9-4d33-8996-5e086822d712,2\"");
    expect(t).not.toBeNull();

    expect(t?.id).toBe("864390a1-3de9-4d33-8996-5e086822d712");

  });

  test('VideoInfo', async () => {

    expect(ThumbnailUrlGraphInfo.FromSPListItemThumbnailUrl("")).toBeNull();
    expect(ThumbnailUrlGraphInfo.FromSPListItemThumbnailUrl("https://contoso.sharepoint.com")).toBeNull();

    // URL is a SP URL normally
    const iContoso = await ThumbnailUrlGraphInfo.FromSPListItemThumbnailUrl("https://contoso.sharepoint.com/_api/v2.0/drives/b!4ssZhlJsDkqydQo9Adc0xDpzNsyFwftAolttlcBPBajqHKl8guEiRYQnzjHqxsp3/items/01UVLXBBVBSBBYN2J5GNGYTFS6BBUCFVYS/thumbnails/0/c90x150/content?prefer=noredirect%2Cclosestavailablesize&cb=%22%7B864390A1%2D3DE9%2D4D33%2D8996%2D5E086822D712%7D%2C2%22");
    expect(iContoso?.listItemGraphUrl).toBe("https://graph.microsoft.com/v1.0/drives/b!4ssZhlJsDkqydQo9Adc0xDpzNsyFwftAolttlcBPBajqHKl8guEiRYQnzjHqxsp3/items/01UVLXBBVBSBBYN2J5GNGYTFS6BBUCFVYS/listItem");
    expect(iContoso?.listItemGraphUrlRelative).toBe("/drives/b!4ssZhlJsDkqydQo9Adc0xDpzNsyFwftAolttlcBPBajqHKl8guEiRYQnzjHqxsp3/items/01UVLXBBVBSBBYN2J5GNGYTFS6BBUCFVYS/listItem");
  });
});


export interface TestFieldValueSet extends FieldValueSet
{    
  [key: string|number]: string | undefined,
  Thumbnail?: string,
  Title: string
}
