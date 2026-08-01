import prisma from '../../../prisma/client.js';
export const getDashboardSummary = async (userId) => {
    // 1. Stats
    const [totalOperations, pendingReview, completedExports] = await Promise.all([
        prisma.operation.count({ where: { userId } }),
        prisma.operation.count({ where: { userId, status: 'REVIEW' } }),
        prisma.operation.count({ where: { userId, operationType: 'GATE_OUT', status: 'COMPLETED' } }), // Assuming export = GATE_OUT + COMPLETED
    ]);
    // Calculate Success Rate from ProcessingJobs
    const [completedJobs, failedJobs] = await Promise.all([
        prisma.processingJob.count({ where: { userId, status: 'COMPLETED' } }),
        prisma.processingJob.count({ where: { userId, status: 'FAILED' } }),
    ]);
    const totalJobs = completedJobs + failedJobs;
    let successRate = 'N/A';
    if (totalJobs > 0) {
        const rate = (completedJobs / totalJobs) * 100;
        successRate = `${rate.toFixed(1)}%`;
    }
    else if (totalOperations > 0 && totalJobs === 0) {
        // If no jobs ran but ops exist, maybe fallback
        successRate = '100%';
    }
    else {
        successRate = '0%';
    }
    const stats = {
        totalOperations,
        pendingReview,
        completedExports,
        successRate,
    };
    // 2. Recent Documents
    const recentDocumentsRaw = await prisma.document.findMany({
        where: { userId },
        include: {
            operation: {
                select: { id: true, operationType: true, status: true, referenceNo: true }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
    });
    const recentDocuments = recentDocumentsRaw.map(doc => ({
        id: doc.id,
        name: doc.originalFileName,
        type: 'Unknown', // Need extraction data for real type
        workflow: doc.operation.operationType === 'GATE_IN' ? 'Import Gate-In' : 'Export Gate-Out',
        processedAt: doc.createdAt,
        status: doc.operation.status === 'COMPLETED' ? 'Verified' : 'Pending',
        operationId: doc.operation.id,
        reference: doc.operation.referenceNo || doc.operation.id
    }));
    // 3. Operational Alerts
    const alerts = [];
    // A. Operations needing review
    const reviewOps = await prisma.operation.findMany({
        where: { userId, status: 'REVIEW' },
        take: 3,
    });
    reviewOps.forEach(op => {
        alerts.push({
            id: `alert-review-${op.id}`,
            title: `Operation ${op.referenceNo || op.id} requires review`,
            action: 'Review Required',
            type: 'warning',
            operationId: op.id
        });
    });
    // B. Failed processing jobs
    const failedJobsList = await prisma.processingJob.findMany({
        where: { userId, status: 'FAILED' },
        include: { operation: { select: { referenceNo: true } } },
        take: 3,
    });
    failedJobsList.forEach(job => {
        alerts.push({
            id: `alert-failed-${job.id}`,
            title: `Processing failed for Operation ${job.operation.referenceNo || job.operationId}`,
            action: 'Retry Failed',
            type: 'error',
            operationId: job.operationId
        });
    });
    // C. Failed document uploads
    const failedDocs = await prisma.document.findMany({
        where: { userId, uploadStatus: 'FAILED' },
        take: 2,
    });
    failedDocs.forEach(doc => {
        alerts.push({
            id: `alert-doc-${doc.id}`,
            title: `Upload failed for ${doc.originalFileName}`,
            action: 'Re-upload',
            type: 'error',
            operationId: doc.operationId
        });
    });
    return {
        stats,
        recentDocuments,
        alerts: alerts.slice(0, 5), // Keep max 5 alerts
    };
};
//# sourceMappingURL=dashboard.service.js.map