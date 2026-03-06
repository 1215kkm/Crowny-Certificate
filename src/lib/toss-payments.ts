// 토스페이먼츠 직접 연동 유틸리티

const TOSS_API_URL = "https://api.tosspayments.com/v1";

function getAuthHeader(): string {
  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) {
    throw new Error("TOSS_SECRET_KEY 환경변수가 설정되지 않았습니다.");
  }
  // 토스페이먼츠는 시크릿키:를 Base64 인코딩하여 Basic Auth로 전송
  const encoded = Buffer.from(`${secretKey}:`).toString("base64");
  return `Basic ${encoded}`;
}

export interface TossPaymentConfirmRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface TossPaymentResponse {
  paymentKey: string;
  orderId: string;
  status: string;
  totalAmount: number;
  method: string;
  requestedAt: string;
  approvedAt: string;
  receipt: { url: string } | null;
  card?: {
    company: string;
    number: string;
    installmentPlanMonths: number;
  };
  virtualAccount?: {
    bankCode: string;
    customerName: string;
    accountNumber: string;
    dueDate: string;
  };
}

// 결제 승인
export async function confirmPayment(
  request: TossPaymentConfirmRequest
): Promise<TossPaymentResponse> {
  const response = await fetch(`${TOSS_API_URL}/payments/confirm`, {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "결제 승인에 실패했습니다.");
  }

  return response.json();
}

// 결제 조회
export async function getPayment(
  paymentKey: string
): Promise<TossPaymentResponse> {
  const response = await fetch(
    `${TOSS_API_URL}/payments/${encodeURIComponent(paymentKey)}`,
    {
      headers: {
        Authorization: getAuthHeader(),
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "결제 조회에 실패했습니다.");
  }

  return response.json();
}

// 결제 취소 (환불)
export async function cancelPayment(
  paymentKey: string,
  cancelReason: string,
  cancelAmount?: number
): Promise<TossPaymentResponse> {
  const body: Record<string, unknown> = { cancelReason };
  if (cancelAmount !== undefined) {
    body.cancelAmount = cancelAmount;
  }

  const response = await fetch(
    `${TOSS_API_URL}/payments/${encodeURIComponent(paymentKey)}/cancel`,
    {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "결제 취소에 실패했습니다.");
  }

  return response.json();
}
