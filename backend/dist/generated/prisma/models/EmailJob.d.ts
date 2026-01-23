import type * as runtime from "@prisma/client/runtime/library";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model EmailJob
 *
 */
export type EmailJobModel = runtime.Types.Result.DefaultSelection<Prisma.$EmailJobPayload>;
export type AggregateEmailJob = {
    _count: EmailJobCountAggregateOutputType | null;
    _min: EmailJobMinAggregateOutputType | null;
    _max: EmailJobMaxAggregateOutputType | null;
};
export type EmailJobMinAggregateOutputType = {
    id: string | null;
    campaignId: string | null;
    recipientEmail: string | null;
    scheduledTime: Date | null;
    sentTime: Date | null;
    status: $Enums.EmailJobStatus | null;
    error: string | null;
};
export type EmailJobMaxAggregateOutputType = {
    id: string | null;
    campaignId: string | null;
    recipientEmail: string | null;
    scheduledTime: Date | null;
    sentTime: Date | null;
    status: $Enums.EmailJobStatus | null;
    error: string | null;
};
export type EmailJobCountAggregateOutputType = {
    id: number;
    campaignId: number;
    recipientEmail: number;
    scheduledTime: number;
    sentTime: number;
    status: number;
    error: number;
    _all: number;
};
export type EmailJobMinAggregateInputType = {
    id?: true;
    campaignId?: true;
    recipientEmail?: true;
    scheduledTime?: true;
    sentTime?: true;
    status?: true;
    error?: true;
};
export type EmailJobMaxAggregateInputType = {
    id?: true;
    campaignId?: true;
    recipientEmail?: true;
    scheduledTime?: true;
    sentTime?: true;
    status?: true;
    error?: true;
};
export type EmailJobCountAggregateInputType = {
    id?: true;
    campaignId?: true;
    recipientEmail?: true;
    scheduledTime?: true;
    sentTime?: true;
    status?: true;
    error?: true;
    _all?: true;
};
export type EmailJobAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which EmailJob to aggregate.
     */
    where?: Prisma.EmailJobWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EmailJobs to fetch.
     */
    orderBy?: Prisma.EmailJobOrderByWithRelationInput | Prisma.EmailJobOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.EmailJobWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EmailJobs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EmailJobs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned EmailJobs
    **/
    _count?: true | EmailJobCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: EmailJobMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: EmailJobMaxAggregateInputType;
};
export type GetEmailJobAggregateType<T extends EmailJobAggregateArgs> = {
    [P in keyof T & keyof AggregateEmailJob]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEmailJob[P]> : Prisma.GetScalarType<T[P], AggregateEmailJob[P]>;
};
export type EmailJobGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EmailJobWhereInput;
    orderBy?: Prisma.EmailJobOrderByWithAggregationInput | Prisma.EmailJobOrderByWithAggregationInput[];
    by: Prisma.EmailJobScalarFieldEnum[] | Prisma.EmailJobScalarFieldEnum;
    having?: Prisma.EmailJobScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EmailJobCountAggregateInputType | true;
    _min?: EmailJobMinAggregateInputType;
    _max?: EmailJobMaxAggregateInputType;
};
export type EmailJobGroupByOutputType = {
    id: string;
    campaignId: string;
    recipientEmail: string;
    scheduledTime: Date;
    sentTime: Date | null;
    status: $Enums.EmailJobStatus;
    error: string | null;
    _count: EmailJobCountAggregateOutputType | null;
    _min: EmailJobMinAggregateOutputType | null;
    _max: EmailJobMaxAggregateOutputType | null;
};
type GetEmailJobGroupByPayload<T extends EmailJobGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EmailJobGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EmailJobGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EmailJobGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EmailJobGroupByOutputType[P]>;
}>>;
export type EmailJobWhereInput = {
    AND?: Prisma.EmailJobWhereInput | Prisma.EmailJobWhereInput[];
    OR?: Prisma.EmailJobWhereInput[];
    NOT?: Prisma.EmailJobWhereInput | Prisma.EmailJobWhereInput[];
    id?: Prisma.StringFilter<"EmailJob"> | string;
    campaignId?: Prisma.StringFilter<"EmailJob"> | string;
    recipientEmail?: Prisma.StringFilter<"EmailJob"> | string;
    scheduledTime?: Prisma.DateTimeFilter<"EmailJob"> | Date | string;
    sentTime?: Prisma.DateTimeNullableFilter<"EmailJob"> | Date | string | null;
    status?: Prisma.EnumEmailJobStatusFilter<"EmailJob"> | $Enums.EmailJobStatus;
    error?: Prisma.StringNullableFilter<"EmailJob"> | string | null;
    campaign?: Prisma.XOR<Prisma.EmailCampaignScalarRelationFilter, Prisma.EmailCampaignWhereInput>;
};
export type EmailJobOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    campaignId?: Prisma.SortOrder;
    recipientEmail?: Prisma.SortOrder;
    scheduledTime?: Prisma.SortOrder;
    sentTime?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    error?: Prisma.SortOrderInput | Prisma.SortOrder;
    campaign?: Prisma.EmailCampaignOrderByWithRelationInput;
    _relevance?: Prisma.EmailJobOrderByRelevanceInput;
};
export type EmailJobWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    campaignId_recipientEmail?: Prisma.EmailJobCampaignIdRecipientEmailCompoundUniqueInput;
    AND?: Prisma.EmailJobWhereInput | Prisma.EmailJobWhereInput[];
    OR?: Prisma.EmailJobWhereInput[];
    NOT?: Prisma.EmailJobWhereInput | Prisma.EmailJobWhereInput[];
    campaignId?: Prisma.StringFilter<"EmailJob"> | string;
    recipientEmail?: Prisma.StringFilter<"EmailJob"> | string;
    scheduledTime?: Prisma.DateTimeFilter<"EmailJob"> | Date | string;
    sentTime?: Prisma.DateTimeNullableFilter<"EmailJob"> | Date | string | null;
    status?: Prisma.EnumEmailJobStatusFilter<"EmailJob"> | $Enums.EmailJobStatus;
    error?: Prisma.StringNullableFilter<"EmailJob"> | string | null;
    campaign?: Prisma.XOR<Prisma.EmailCampaignScalarRelationFilter, Prisma.EmailCampaignWhereInput>;
}, "id" | "campaignId_recipientEmail">;
export type EmailJobOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    campaignId?: Prisma.SortOrder;
    recipientEmail?: Prisma.SortOrder;
    scheduledTime?: Prisma.SortOrder;
    sentTime?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    error?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.EmailJobCountOrderByAggregateInput;
    _max?: Prisma.EmailJobMaxOrderByAggregateInput;
    _min?: Prisma.EmailJobMinOrderByAggregateInput;
};
export type EmailJobScalarWhereWithAggregatesInput = {
    AND?: Prisma.EmailJobScalarWhereWithAggregatesInput | Prisma.EmailJobScalarWhereWithAggregatesInput[];
    OR?: Prisma.EmailJobScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EmailJobScalarWhereWithAggregatesInput | Prisma.EmailJobScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"EmailJob"> | string;
    campaignId?: Prisma.StringWithAggregatesFilter<"EmailJob"> | string;
    recipientEmail?: Prisma.StringWithAggregatesFilter<"EmailJob"> | string;
    scheduledTime?: Prisma.DateTimeWithAggregatesFilter<"EmailJob"> | Date | string;
    sentTime?: Prisma.DateTimeNullableWithAggregatesFilter<"EmailJob"> | Date | string | null;
    status?: Prisma.EnumEmailJobStatusWithAggregatesFilter<"EmailJob"> | $Enums.EmailJobStatus;
    error?: Prisma.StringNullableWithAggregatesFilter<"EmailJob"> | string | null;
};
export type EmailJobCreateInput = {
    id?: string;
    recipientEmail: string;
    scheduledTime: Date | string;
    sentTime?: Date | string | null;
    status?: $Enums.EmailJobStatus;
    error?: string | null;
    campaign: Prisma.EmailCampaignCreateNestedOneWithoutJobsInput;
};
export type EmailJobUncheckedCreateInput = {
    id?: string;
    campaignId: string;
    recipientEmail: string;
    scheduledTime: Date | string;
    sentTime?: Date | string | null;
    status?: $Enums.EmailJobStatus;
    error?: string | null;
};
export type EmailJobUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    recipientEmail?: Prisma.StringFieldUpdateOperationsInput | string;
    scheduledTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sentTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumEmailJobStatusFieldUpdateOperationsInput | $Enums.EmailJobStatus;
    error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    campaign?: Prisma.EmailCampaignUpdateOneRequiredWithoutJobsNestedInput;
};
export type EmailJobUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    campaignId?: Prisma.StringFieldUpdateOperationsInput | string;
    recipientEmail?: Prisma.StringFieldUpdateOperationsInput | string;
    scheduledTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sentTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumEmailJobStatusFieldUpdateOperationsInput | $Enums.EmailJobStatus;
    error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type EmailJobCreateManyInput = {
    id?: string;
    campaignId: string;
    recipientEmail: string;
    scheduledTime: Date | string;
    sentTime?: Date | string | null;
    status?: $Enums.EmailJobStatus;
    error?: string | null;
};
export type EmailJobUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    recipientEmail?: Prisma.StringFieldUpdateOperationsInput | string;
    scheduledTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sentTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumEmailJobStatusFieldUpdateOperationsInput | $Enums.EmailJobStatus;
    error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type EmailJobUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    campaignId?: Prisma.StringFieldUpdateOperationsInput | string;
    recipientEmail?: Prisma.StringFieldUpdateOperationsInput | string;
    scheduledTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sentTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumEmailJobStatusFieldUpdateOperationsInput | $Enums.EmailJobStatus;
    error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type EmailJobListRelationFilter = {
    every?: Prisma.EmailJobWhereInput;
    some?: Prisma.EmailJobWhereInput;
    none?: Prisma.EmailJobWhereInput;
};
export type EmailJobOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type EmailJobOrderByRelevanceInput = {
    fields: Prisma.EmailJobOrderByRelevanceFieldEnum | Prisma.EmailJobOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type EmailJobCampaignIdRecipientEmailCompoundUniqueInput = {
    campaignId: string;
    recipientEmail: string;
};
export type EmailJobCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    campaignId?: Prisma.SortOrder;
    recipientEmail?: Prisma.SortOrder;
    scheduledTime?: Prisma.SortOrder;
    sentTime?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    error?: Prisma.SortOrder;
};
export type EmailJobMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    campaignId?: Prisma.SortOrder;
    recipientEmail?: Prisma.SortOrder;
    scheduledTime?: Prisma.SortOrder;
    sentTime?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    error?: Prisma.SortOrder;
};
export type EmailJobMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    campaignId?: Prisma.SortOrder;
    recipientEmail?: Prisma.SortOrder;
    scheduledTime?: Prisma.SortOrder;
    sentTime?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    error?: Prisma.SortOrder;
};
export type EmailJobCreateNestedManyWithoutCampaignInput = {
    create?: Prisma.XOR<Prisma.EmailJobCreateWithoutCampaignInput, Prisma.EmailJobUncheckedCreateWithoutCampaignInput> | Prisma.EmailJobCreateWithoutCampaignInput[] | Prisma.EmailJobUncheckedCreateWithoutCampaignInput[];
    connectOrCreate?: Prisma.EmailJobCreateOrConnectWithoutCampaignInput | Prisma.EmailJobCreateOrConnectWithoutCampaignInput[];
    createMany?: Prisma.EmailJobCreateManyCampaignInputEnvelope;
    connect?: Prisma.EmailJobWhereUniqueInput | Prisma.EmailJobWhereUniqueInput[];
};
export type EmailJobUncheckedCreateNestedManyWithoutCampaignInput = {
    create?: Prisma.XOR<Prisma.EmailJobCreateWithoutCampaignInput, Prisma.EmailJobUncheckedCreateWithoutCampaignInput> | Prisma.EmailJobCreateWithoutCampaignInput[] | Prisma.EmailJobUncheckedCreateWithoutCampaignInput[];
    connectOrCreate?: Prisma.EmailJobCreateOrConnectWithoutCampaignInput | Prisma.EmailJobCreateOrConnectWithoutCampaignInput[];
    createMany?: Prisma.EmailJobCreateManyCampaignInputEnvelope;
    connect?: Prisma.EmailJobWhereUniqueInput | Prisma.EmailJobWhereUniqueInput[];
};
export type EmailJobUpdateManyWithoutCampaignNestedInput = {
    create?: Prisma.XOR<Prisma.EmailJobCreateWithoutCampaignInput, Prisma.EmailJobUncheckedCreateWithoutCampaignInput> | Prisma.EmailJobCreateWithoutCampaignInput[] | Prisma.EmailJobUncheckedCreateWithoutCampaignInput[];
    connectOrCreate?: Prisma.EmailJobCreateOrConnectWithoutCampaignInput | Prisma.EmailJobCreateOrConnectWithoutCampaignInput[];
    upsert?: Prisma.EmailJobUpsertWithWhereUniqueWithoutCampaignInput | Prisma.EmailJobUpsertWithWhereUniqueWithoutCampaignInput[];
    createMany?: Prisma.EmailJobCreateManyCampaignInputEnvelope;
    set?: Prisma.EmailJobWhereUniqueInput | Prisma.EmailJobWhereUniqueInput[];
    disconnect?: Prisma.EmailJobWhereUniqueInput | Prisma.EmailJobWhereUniqueInput[];
    delete?: Prisma.EmailJobWhereUniqueInput | Prisma.EmailJobWhereUniqueInput[];
    connect?: Prisma.EmailJobWhereUniqueInput | Prisma.EmailJobWhereUniqueInput[];
    update?: Prisma.EmailJobUpdateWithWhereUniqueWithoutCampaignInput | Prisma.EmailJobUpdateWithWhereUniqueWithoutCampaignInput[];
    updateMany?: Prisma.EmailJobUpdateManyWithWhereWithoutCampaignInput | Prisma.EmailJobUpdateManyWithWhereWithoutCampaignInput[];
    deleteMany?: Prisma.EmailJobScalarWhereInput | Prisma.EmailJobScalarWhereInput[];
};
export type EmailJobUncheckedUpdateManyWithoutCampaignNestedInput = {
    create?: Prisma.XOR<Prisma.EmailJobCreateWithoutCampaignInput, Prisma.EmailJobUncheckedCreateWithoutCampaignInput> | Prisma.EmailJobCreateWithoutCampaignInput[] | Prisma.EmailJobUncheckedCreateWithoutCampaignInput[];
    connectOrCreate?: Prisma.EmailJobCreateOrConnectWithoutCampaignInput | Prisma.EmailJobCreateOrConnectWithoutCampaignInput[];
    upsert?: Prisma.EmailJobUpsertWithWhereUniqueWithoutCampaignInput | Prisma.EmailJobUpsertWithWhereUniqueWithoutCampaignInput[];
    createMany?: Prisma.EmailJobCreateManyCampaignInputEnvelope;
    set?: Prisma.EmailJobWhereUniqueInput | Prisma.EmailJobWhereUniqueInput[];
    disconnect?: Prisma.EmailJobWhereUniqueInput | Prisma.EmailJobWhereUniqueInput[];
    delete?: Prisma.EmailJobWhereUniqueInput | Prisma.EmailJobWhereUniqueInput[];
    connect?: Prisma.EmailJobWhereUniqueInput | Prisma.EmailJobWhereUniqueInput[];
    update?: Prisma.EmailJobUpdateWithWhereUniqueWithoutCampaignInput | Prisma.EmailJobUpdateWithWhereUniqueWithoutCampaignInput[];
    updateMany?: Prisma.EmailJobUpdateManyWithWhereWithoutCampaignInput | Prisma.EmailJobUpdateManyWithWhereWithoutCampaignInput[];
    deleteMany?: Prisma.EmailJobScalarWhereInput | Prisma.EmailJobScalarWhereInput[];
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type EnumEmailJobStatusFieldUpdateOperationsInput = {
    set?: $Enums.EmailJobStatus;
};
export type EmailJobCreateWithoutCampaignInput = {
    id?: string;
    recipientEmail: string;
    scheduledTime: Date | string;
    sentTime?: Date | string | null;
    status?: $Enums.EmailJobStatus;
    error?: string | null;
};
export type EmailJobUncheckedCreateWithoutCampaignInput = {
    id?: string;
    recipientEmail: string;
    scheduledTime: Date | string;
    sentTime?: Date | string | null;
    status?: $Enums.EmailJobStatus;
    error?: string | null;
};
export type EmailJobCreateOrConnectWithoutCampaignInput = {
    where: Prisma.EmailJobWhereUniqueInput;
    create: Prisma.XOR<Prisma.EmailJobCreateWithoutCampaignInput, Prisma.EmailJobUncheckedCreateWithoutCampaignInput>;
};
export type EmailJobCreateManyCampaignInputEnvelope = {
    data: Prisma.EmailJobCreateManyCampaignInput | Prisma.EmailJobCreateManyCampaignInput[];
    skipDuplicates?: boolean;
};
export type EmailJobUpsertWithWhereUniqueWithoutCampaignInput = {
    where: Prisma.EmailJobWhereUniqueInput;
    update: Prisma.XOR<Prisma.EmailJobUpdateWithoutCampaignInput, Prisma.EmailJobUncheckedUpdateWithoutCampaignInput>;
    create: Prisma.XOR<Prisma.EmailJobCreateWithoutCampaignInput, Prisma.EmailJobUncheckedCreateWithoutCampaignInput>;
};
export type EmailJobUpdateWithWhereUniqueWithoutCampaignInput = {
    where: Prisma.EmailJobWhereUniqueInput;
    data: Prisma.XOR<Prisma.EmailJobUpdateWithoutCampaignInput, Prisma.EmailJobUncheckedUpdateWithoutCampaignInput>;
};
export type EmailJobUpdateManyWithWhereWithoutCampaignInput = {
    where: Prisma.EmailJobScalarWhereInput;
    data: Prisma.XOR<Prisma.EmailJobUpdateManyMutationInput, Prisma.EmailJobUncheckedUpdateManyWithoutCampaignInput>;
};
export type EmailJobScalarWhereInput = {
    AND?: Prisma.EmailJobScalarWhereInput | Prisma.EmailJobScalarWhereInput[];
    OR?: Prisma.EmailJobScalarWhereInput[];
    NOT?: Prisma.EmailJobScalarWhereInput | Prisma.EmailJobScalarWhereInput[];
    id?: Prisma.StringFilter<"EmailJob"> | string;
    campaignId?: Prisma.StringFilter<"EmailJob"> | string;
    recipientEmail?: Prisma.StringFilter<"EmailJob"> | string;
    scheduledTime?: Prisma.DateTimeFilter<"EmailJob"> | Date | string;
    sentTime?: Prisma.DateTimeNullableFilter<"EmailJob"> | Date | string | null;
    status?: Prisma.EnumEmailJobStatusFilter<"EmailJob"> | $Enums.EmailJobStatus;
    error?: Prisma.StringNullableFilter<"EmailJob"> | string | null;
};
export type EmailJobCreateManyCampaignInput = {
    id?: string;
    recipientEmail: string;
    scheduledTime: Date | string;
    sentTime?: Date | string | null;
    status?: $Enums.EmailJobStatus;
    error?: string | null;
};
export type EmailJobUpdateWithoutCampaignInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    recipientEmail?: Prisma.StringFieldUpdateOperationsInput | string;
    scheduledTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sentTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumEmailJobStatusFieldUpdateOperationsInput | $Enums.EmailJobStatus;
    error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type EmailJobUncheckedUpdateWithoutCampaignInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    recipientEmail?: Prisma.StringFieldUpdateOperationsInput | string;
    scheduledTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sentTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumEmailJobStatusFieldUpdateOperationsInput | $Enums.EmailJobStatus;
    error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type EmailJobUncheckedUpdateManyWithoutCampaignInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    recipientEmail?: Prisma.StringFieldUpdateOperationsInput | string;
    scheduledTime?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sentTime?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumEmailJobStatusFieldUpdateOperationsInput | $Enums.EmailJobStatus;
    error?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type EmailJobSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    campaignId?: boolean;
    recipientEmail?: boolean;
    scheduledTime?: boolean;
    sentTime?: boolean;
    status?: boolean;
    error?: boolean;
    campaign?: boolean | Prisma.EmailCampaignDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["emailJob"]>;
export type EmailJobSelectScalar = {
    id?: boolean;
    campaignId?: boolean;
    recipientEmail?: boolean;
    scheduledTime?: boolean;
    sentTime?: boolean;
    status?: boolean;
    error?: boolean;
};
export type EmailJobOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "campaignId" | "recipientEmail" | "scheduledTime" | "sentTime" | "status" | "error", ExtArgs["result"]["emailJob"]>;
export type EmailJobInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    campaign?: boolean | Prisma.EmailCampaignDefaultArgs<ExtArgs>;
};
export type $EmailJobPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "EmailJob";
    objects: {
        campaign: Prisma.$EmailCampaignPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        campaignId: string;
        recipientEmail: string;
        scheduledTime: Date;
        sentTime: Date | null;
        status: $Enums.EmailJobStatus;
        error: string | null;
    }, ExtArgs["result"]["emailJob"]>;
    composites: {};
};
export type EmailJobGetPayload<S extends boolean | null | undefined | EmailJobDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EmailJobPayload, S>;
export type EmailJobCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EmailJobFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EmailJobCountAggregateInputType | true;
};
export interface EmailJobDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['EmailJob'];
        meta: {
            name: 'EmailJob';
        };
    };
    /**
     * Find zero or one EmailJob that matches the filter.
     * @param {EmailJobFindUniqueArgs} args - Arguments to find a EmailJob
     * @example
     * // Get one EmailJob
     * const emailJob = await prisma.emailJob.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EmailJobFindUniqueArgs>(args: Prisma.SelectSubset<T, EmailJobFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EmailJobClient<runtime.Types.Result.GetResult<Prisma.$EmailJobPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one EmailJob that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EmailJobFindUniqueOrThrowArgs} args - Arguments to find a EmailJob
     * @example
     * // Get one EmailJob
     * const emailJob = await prisma.emailJob.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EmailJobFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EmailJobFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EmailJobClient<runtime.Types.Result.GetResult<Prisma.$EmailJobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first EmailJob that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailJobFindFirstArgs} args - Arguments to find a EmailJob
     * @example
     * // Get one EmailJob
     * const emailJob = await prisma.emailJob.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EmailJobFindFirstArgs>(args?: Prisma.SelectSubset<T, EmailJobFindFirstArgs<ExtArgs>>): Prisma.Prisma__EmailJobClient<runtime.Types.Result.GetResult<Prisma.$EmailJobPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first EmailJob that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailJobFindFirstOrThrowArgs} args - Arguments to find a EmailJob
     * @example
     * // Get one EmailJob
     * const emailJob = await prisma.emailJob.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EmailJobFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EmailJobFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EmailJobClient<runtime.Types.Result.GetResult<Prisma.$EmailJobPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more EmailJobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailJobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EmailJobs
     * const emailJobs = await prisma.emailJob.findMany()
     *
     * // Get first 10 EmailJobs
     * const emailJobs = await prisma.emailJob.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const emailJobWithIdOnly = await prisma.emailJob.findMany({ select: { id: true } })
     *
     */
    findMany<T extends EmailJobFindManyArgs>(args?: Prisma.SelectSubset<T, EmailJobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EmailJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a EmailJob.
     * @param {EmailJobCreateArgs} args - Arguments to create a EmailJob.
     * @example
     * // Create one EmailJob
     * const EmailJob = await prisma.emailJob.create({
     *   data: {
     *     // ... data to create a EmailJob
     *   }
     * })
     *
     */
    create<T extends EmailJobCreateArgs>(args: Prisma.SelectSubset<T, EmailJobCreateArgs<ExtArgs>>): Prisma.Prisma__EmailJobClient<runtime.Types.Result.GetResult<Prisma.$EmailJobPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many EmailJobs.
     * @param {EmailJobCreateManyArgs} args - Arguments to create many EmailJobs.
     * @example
     * // Create many EmailJobs
     * const emailJob = await prisma.emailJob.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends EmailJobCreateManyArgs>(args?: Prisma.SelectSubset<T, EmailJobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a EmailJob.
     * @param {EmailJobDeleteArgs} args - Arguments to delete one EmailJob.
     * @example
     * // Delete one EmailJob
     * const EmailJob = await prisma.emailJob.delete({
     *   where: {
     *     // ... filter to delete one EmailJob
     *   }
     * })
     *
     */
    delete<T extends EmailJobDeleteArgs>(args: Prisma.SelectSubset<T, EmailJobDeleteArgs<ExtArgs>>): Prisma.Prisma__EmailJobClient<runtime.Types.Result.GetResult<Prisma.$EmailJobPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one EmailJob.
     * @param {EmailJobUpdateArgs} args - Arguments to update one EmailJob.
     * @example
     * // Update one EmailJob
     * const emailJob = await prisma.emailJob.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends EmailJobUpdateArgs>(args: Prisma.SelectSubset<T, EmailJobUpdateArgs<ExtArgs>>): Prisma.Prisma__EmailJobClient<runtime.Types.Result.GetResult<Prisma.$EmailJobPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more EmailJobs.
     * @param {EmailJobDeleteManyArgs} args - Arguments to filter EmailJobs to delete.
     * @example
     * // Delete a few EmailJobs
     * const { count } = await prisma.emailJob.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends EmailJobDeleteManyArgs>(args?: Prisma.SelectSubset<T, EmailJobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more EmailJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailJobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EmailJobs
     * const emailJob = await prisma.emailJob.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends EmailJobUpdateManyArgs>(args: Prisma.SelectSubset<T, EmailJobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one EmailJob.
     * @param {EmailJobUpsertArgs} args - Arguments to update or create a EmailJob.
     * @example
     * // Update or create a EmailJob
     * const emailJob = await prisma.emailJob.upsert({
     *   create: {
     *     // ... data to create a EmailJob
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EmailJob we want to update
     *   }
     * })
     */
    upsert<T extends EmailJobUpsertArgs>(args: Prisma.SelectSubset<T, EmailJobUpsertArgs<ExtArgs>>): Prisma.Prisma__EmailJobClient<runtime.Types.Result.GetResult<Prisma.$EmailJobPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of EmailJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailJobCountArgs} args - Arguments to filter EmailJobs to count.
     * @example
     * // Count the number of EmailJobs
     * const count = await prisma.emailJob.count({
     *   where: {
     *     // ... the filter for the EmailJobs we want to count
     *   }
     * })
    **/
    count<T extends EmailJobCountArgs>(args?: Prisma.Subset<T, EmailJobCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EmailJobCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a EmailJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailJobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EmailJobAggregateArgs>(args: Prisma.Subset<T, EmailJobAggregateArgs>): Prisma.PrismaPromise<GetEmailJobAggregateType<T>>;
    /**
     * Group by EmailJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailJobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends EmailJobGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EmailJobGroupByArgs['orderBy'];
    } : {
        orderBy?: EmailJobGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EmailJobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmailJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the EmailJob model
     */
    readonly fields: EmailJobFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for EmailJob.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__EmailJobClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    campaign<T extends Prisma.EmailCampaignDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EmailCampaignDefaultArgs<ExtArgs>>): Prisma.Prisma__EmailCampaignClient<runtime.Types.Result.GetResult<Prisma.$EmailCampaignPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the EmailJob model
 */
export interface EmailJobFieldRefs {
    readonly id: Prisma.FieldRef<"EmailJob", 'String'>;
    readonly campaignId: Prisma.FieldRef<"EmailJob", 'String'>;
    readonly recipientEmail: Prisma.FieldRef<"EmailJob", 'String'>;
    readonly scheduledTime: Prisma.FieldRef<"EmailJob", 'DateTime'>;
    readonly sentTime: Prisma.FieldRef<"EmailJob", 'DateTime'>;
    readonly status: Prisma.FieldRef<"EmailJob", 'EmailJobStatus'>;
    readonly error: Prisma.FieldRef<"EmailJob", 'String'>;
}
/**
 * EmailJob findUnique
 */
export type EmailJobFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailJob
     */
    select?: Prisma.EmailJobSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the EmailJob
     */
    omit?: Prisma.EmailJobOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.EmailJobInclude<ExtArgs> | null;
    /**
     * Filter, which EmailJob to fetch.
     */
    where: Prisma.EmailJobWhereUniqueInput;
};
/**
 * EmailJob findUniqueOrThrow
 */
export type EmailJobFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailJob
     */
    select?: Prisma.EmailJobSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the EmailJob
     */
    omit?: Prisma.EmailJobOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.EmailJobInclude<ExtArgs> | null;
    /**
     * Filter, which EmailJob to fetch.
     */
    where: Prisma.EmailJobWhereUniqueInput;
};
/**
 * EmailJob findFirst
 */
export type EmailJobFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailJob
     */
    select?: Prisma.EmailJobSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the EmailJob
     */
    omit?: Prisma.EmailJobOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.EmailJobInclude<ExtArgs> | null;
    /**
     * Filter, which EmailJob to fetch.
     */
    where?: Prisma.EmailJobWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EmailJobs to fetch.
     */
    orderBy?: Prisma.EmailJobOrderByWithRelationInput | Prisma.EmailJobOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for EmailJobs.
     */
    cursor?: Prisma.EmailJobWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EmailJobs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EmailJobs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of EmailJobs.
     */
    distinct?: Prisma.EmailJobScalarFieldEnum | Prisma.EmailJobScalarFieldEnum[];
};
/**
 * EmailJob findFirstOrThrow
 */
export type EmailJobFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailJob
     */
    select?: Prisma.EmailJobSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the EmailJob
     */
    omit?: Prisma.EmailJobOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.EmailJobInclude<ExtArgs> | null;
    /**
     * Filter, which EmailJob to fetch.
     */
    where?: Prisma.EmailJobWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EmailJobs to fetch.
     */
    orderBy?: Prisma.EmailJobOrderByWithRelationInput | Prisma.EmailJobOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for EmailJobs.
     */
    cursor?: Prisma.EmailJobWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EmailJobs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EmailJobs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of EmailJobs.
     */
    distinct?: Prisma.EmailJobScalarFieldEnum | Prisma.EmailJobScalarFieldEnum[];
};
/**
 * EmailJob findMany
 */
export type EmailJobFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailJob
     */
    select?: Prisma.EmailJobSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the EmailJob
     */
    omit?: Prisma.EmailJobOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.EmailJobInclude<ExtArgs> | null;
    /**
     * Filter, which EmailJobs to fetch.
     */
    where?: Prisma.EmailJobWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EmailJobs to fetch.
     */
    orderBy?: Prisma.EmailJobOrderByWithRelationInput | Prisma.EmailJobOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing EmailJobs.
     */
    cursor?: Prisma.EmailJobWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EmailJobs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EmailJobs.
     */
    skip?: number;
    distinct?: Prisma.EmailJobScalarFieldEnum | Prisma.EmailJobScalarFieldEnum[];
};
/**
 * EmailJob create
 */
export type EmailJobCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailJob
     */
    select?: Prisma.EmailJobSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the EmailJob
     */
    omit?: Prisma.EmailJobOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.EmailJobInclude<ExtArgs> | null;
    /**
     * The data needed to create a EmailJob.
     */
    data: Prisma.XOR<Prisma.EmailJobCreateInput, Prisma.EmailJobUncheckedCreateInput>;
};
/**
 * EmailJob createMany
 */
export type EmailJobCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many EmailJobs.
     */
    data: Prisma.EmailJobCreateManyInput | Prisma.EmailJobCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * EmailJob update
 */
export type EmailJobUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailJob
     */
    select?: Prisma.EmailJobSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the EmailJob
     */
    omit?: Prisma.EmailJobOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.EmailJobInclude<ExtArgs> | null;
    /**
     * The data needed to update a EmailJob.
     */
    data: Prisma.XOR<Prisma.EmailJobUpdateInput, Prisma.EmailJobUncheckedUpdateInput>;
    /**
     * Choose, which EmailJob to update.
     */
    where: Prisma.EmailJobWhereUniqueInput;
};
/**
 * EmailJob updateMany
 */
export type EmailJobUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update EmailJobs.
     */
    data: Prisma.XOR<Prisma.EmailJobUpdateManyMutationInput, Prisma.EmailJobUncheckedUpdateManyInput>;
    /**
     * Filter which EmailJobs to update
     */
    where?: Prisma.EmailJobWhereInput;
    /**
     * Limit how many EmailJobs to update.
     */
    limit?: number;
};
/**
 * EmailJob upsert
 */
export type EmailJobUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailJob
     */
    select?: Prisma.EmailJobSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the EmailJob
     */
    omit?: Prisma.EmailJobOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.EmailJobInclude<ExtArgs> | null;
    /**
     * The filter to search for the EmailJob to update in case it exists.
     */
    where: Prisma.EmailJobWhereUniqueInput;
    /**
     * In case the EmailJob found by the `where` argument doesn't exist, create a new EmailJob with this data.
     */
    create: Prisma.XOR<Prisma.EmailJobCreateInput, Prisma.EmailJobUncheckedCreateInput>;
    /**
     * In case the EmailJob was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.EmailJobUpdateInput, Prisma.EmailJobUncheckedUpdateInput>;
};
/**
 * EmailJob delete
 */
export type EmailJobDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailJob
     */
    select?: Prisma.EmailJobSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the EmailJob
     */
    omit?: Prisma.EmailJobOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.EmailJobInclude<ExtArgs> | null;
    /**
     * Filter which EmailJob to delete.
     */
    where: Prisma.EmailJobWhereUniqueInput;
};
/**
 * EmailJob deleteMany
 */
export type EmailJobDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which EmailJobs to delete
     */
    where?: Prisma.EmailJobWhereInput;
    /**
     * Limit how many EmailJobs to delete.
     */
    limit?: number;
};
/**
 * EmailJob without action
 */
export type EmailJobDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailJob
     */
    select?: Prisma.EmailJobSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the EmailJob
     */
    omit?: Prisma.EmailJobOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.EmailJobInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=EmailJob.d.ts.map