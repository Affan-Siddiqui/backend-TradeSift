export declare const getDashboardSummary: (userId: string) => Promise<{
    stats: {
        totalOperations: number;
        pendingReview: number;
        completedExports: number;
        successRate: string;
    };
    recentDocuments: {
        id: string;
        name: string;
        type: string;
        workflow: string;
        processedAt: Date;
        status: string;
        operationId: string;
        reference: string;
    }[];
    alerts: {
        id: string;
        title: string;
        action: string;
        type: string;
        operationId: string;
    }[];
}>;
//# sourceMappingURL=dashboard.service.d.ts.map