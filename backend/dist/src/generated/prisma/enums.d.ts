export declare const EmailCampaignStatus: {
    readonly scheduled: "scheduled";
    readonly running: "running";
    readonly completed: "completed";
};
export type EmailCampaignStatus = (typeof EmailCampaignStatus)[keyof typeof EmailCampaignStatus];
export declare const EmailJobStatus: {
    readonly scheduled: "scheduled";
    readonly sent: "sent";
    readonly failed: "failed";
    readonly retrying: "retrying";
};
export type EmailJobStatus = (typeof EmailJobStatus)[keyof typeof EmailJobStatus];
//# sourceMappingURL=enums.d.ts.map