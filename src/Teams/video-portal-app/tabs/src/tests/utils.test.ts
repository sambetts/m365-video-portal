import { getSiteUrl } from "../utils/sputils";

describe('Util tests', () => {
  test('VideoList.FromPlayListSPListItems', () => {

    expect(getSiteUrl("")).toBeNull();
    expect(getSiteUrl("https://contoso-my.sharepoint.com/")).toBeNull();

    expect(getSiteUrl("https://contoso-my.sharepoint.com/personal/admin_m365x72460609_onmicrosoft_com/Documents/whatevs")).toBe("https://contoso-my.sharepoint.com/personal/admin_m365x72460609_onmicrosoft_com");
    expect(getSiteUrl("https://contoso.sharepoint.com/sites/site/Documents/whatevs")).toBe("https://contoso.sharepoint.com/sites/site");

  });
});
