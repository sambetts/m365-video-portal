import { FieldValueSet } from "@microsoft/microsoft-graph-types";


export function getSPItemFieldValue(fields: FieldValueSet | null, propName: string): string | null {
    if (fields) {

        // Do we have a thumbnail field? 
        let fieldVal: string | null = null;
        Object.keys(fields).forEach(key => {

            if (key === propName) {
                const a = (fields) as any;
                const keyVal = a[key];
                fieldVal = keyVal;
            }
        });
        return fieldVal;
    }

    return null
}

// https://contoso-my.sharepoint.com/personal/admin_m365x72460609_onmicrosoft_com/Documents/whatevs -> https://contoso-my.sharepoint.com/personal/admin_m365x72460609_onmicrosoft_com
// https://contoso.sharepoint.com/sites/intranet/Documents/whatevs -> https://contoso.sharepoint.com/sites/intranet
// Get https://contoso.sharepoint.com
export function getSiteUrl(url: string | null): string | null {

    if (url) {
        url = url.toLowerCase();

        // Look for personal & sites scopes
        const SCOPE_PERSONAL = "/personal/";
        const SCOPE_SITES = "/sites/";
        let spScopeLen = SCOPE_PERSONAL.length;
        let spScopeLoc = url.indexOf(SCOPE_PERSONAL);
        if (spScopeLoc === -1) {
            spScopeLoc = url.indexOf(SCOPE_SITES);
            spScopeLen = SCOPE_SITES.length
        }
    
        if (spScopeLoc > -1) {
    
            const siteFragmentStart = spScopeLoc + spScopeLen;
            const nextSlash = url.indexOf("/", siteFragmentStart);
            if (nextSlash > -1) {
                return url.substring(0, nextSlash);
            }
        }
        else {
            const SP_DOMAIN = "sharepoint.com";
            const spDomainLoc = url.indexOf(SP_DOMAIN);
            if (spDomainLoc > -1) {
                return url.substring(0, spDomainLoc + SP_DOMAIN.length);
            }
        }
    }


    return null;
}



// Get      https://m365x72460609.sharepoint.com/_api/v2.0/drives/blah/items/01AFIF2ZAU2EKZF3HS6BAJS36TQJ2BJPFA/thumbnails/0/c90x150/content?prefer=noredirect%2Cclosestavailablesize&cb=%22%7B9215D114%2DF2EC%2D40F0%2D996F%2DD3827414BCA0%7D%2C3%22
// Return   https://graph.microsoft.com/v1.0/drives/blah/items/01AFIF2ZAU2EKZF3HS6BAJS36TQJ2BJPFA
export function getGraphItemUrlFromSpoApiUrl(url: string): string | null {
    if (url && url.length > 0) {

        const urlLower = url.toLowerCase();
        const ITEMS = "/items/";
        const itemsLoc = urlLower.indexOf(ITEMS);
        if (itemsLoc > -1) {
            const nextSlashStart = itemsLoc + ITEMS.length;

            const nextSlashLoc = urlLower.indexOf("/", nextSlashStart);
            if (nextSlashLoc > -1) {
                const itemsSpUrl = url.substring(0, nextSlashLoc) + "/listItem";
                return getGraphUrlFromSpoApiUrl(itemsSpUrl);
            }
        }
    }

    return null;
}

// Get      https://m365x72460609.sharepoint.com/_api/v2.0/drives/blah/items/01AFIF2ZAU2EKZF3HS6BAJS36TQJ2BJPFA/thumbnails/0/c90x150/content?prefer=noredirect%2Cclosestavailablesize&cb=%22%7B9215D114%2DF2EC%2D40F0%2D996F%2DD3827414BCA0%7D%2C3%22
// Return   https://graph.microsoft.com/v1.0/drives/blah/items/01AFIF2ZAU2EKZF3HS6BAJS36TQJ2BJPFA/thumbnails/0/c90x150/content?prefer=noredirect%2Cclosestavailablesize&cb=%22%7B9215D114%2DF2EC%2D40F0%2D996F%2DD3827414BCA0%7D%2C3%22
export function getGraphUrlFromSpoApiUrl(url: string): string | null {
    if (url && url.length > 0) {

        const urlParsed = (new URL(url));
        return url.replace(urlParsed.hostname + "/_api/v2.0", "graph.microsoft.com/v1.0");
    }

    return null;
}
