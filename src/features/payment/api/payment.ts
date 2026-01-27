export interface PaymentRequest {
    orderId: string;
    orderName: string;
    amount: number;
}

export interface PaymentResponse {
    paymentKey: string;
    orderId: string;
    amount: number;
    status: 'DONE' | 'ABORTED' | 'CANCELED';
}

/**
 * [MOCK] Toss Payments 결제 요청 (Backend Proxy)
 * 실제로는 백엔드 서버에 결제 승인 요청을 하기 전 사전 작업을 수행합니다.
 */
export const requestMockPayment = async (data: PaymentRequest): Promise<{ paymentKey: string, method: string }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                paymentKey: `pk_${Date.now()}_mock`,
                method: '카드'
            });
        }, 1000);
    });
};

/**
 * [MOCK] 결제 승인 요청 (Backend)
 * Toss Payments SDK를 통해 결제가 완료된 후, 백엔드 서버로 승인 처리를 요청합니다.
 */
export const verifyMockPayment = async (
    paymentKey: string,
    orderId: string,
    amount: number
): Promise<PaymentResponse> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                paymentKey,
                orderId,
                amount,
                status: 'DONE',
            });
        }, 1500);
    });
};
