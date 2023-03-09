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
export function getSiteUrl(url: string): string | null {
    url = url.toLowerCase();
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

    return null;
}
