export interface Annotation {
    exactMatch: string;
    context: string;
}

/**
 * getEvidenceCoordinates
 * A utility function for the UI to know exactly where to draw yellow highlights in the PDF or Email.
 * 
 * @param insight - The semantic insight or search query (e.g., "Blurred vision")
 * @param sourceFile - The specific document or source ID being analyzed
 * @returns Annotation - the mock coordinates containing exact string matching and context mapping.
 */
export function getEvidenceCoordinates(insight: string, sourceFile: string): Annotation | null {
    const insightLower = insight.toLowerCase();
    const sourceLower = sourceFile.toLowerCase();

    // Demo Hard-coding: Arthur Vance demo - Email
    // The sentence 'vision has been a bit blurry' in the Feb 14 email.
    if (insightLower.includes("vision") || insightLower.includes("blurry") || sourceLower.includes("email") || sourceLower.includes("feb 14")) {
        return {
            exactMatch: "vision has been a bit blurry",
            context: "Message ID: msg_1042_Feb14",
        };
    }

    // Demo Hard-coding: Arthur Vance demo - PDF
    // The value '8.2%' in the row labeled 'HbA1c' in the Feb 20 PDF.
    if (insightLower.includes("hba1c") || sourceLower.includes("pdf") || sourceLower.includes("feb 20")) {
        return {
            exactMatch: "8.2%",
            context: "Page 1, Row 'HbA1c'",
        };
    }

    return null;
}
