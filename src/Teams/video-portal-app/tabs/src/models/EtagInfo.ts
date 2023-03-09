

export class EtagInfo {
    id: string;
    constructor(id: string) {
        this.id = id;
    }

    // Example: "864390a1-3de9-4d33-8996-5e086822d712,2"
    public static FromEtag(tag: string): EtagInfo | null {
        if (tag && tag.length > 1) {
            const COMMA = ",";
            const commaLoc = tag.indexOf(COMMA);
            if (commaLoc > -1) {
                return new EtagInfo(tag.substring(1, commaLoc))
            }
        }
        return null;
    }
}
