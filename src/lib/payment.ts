// PortOne V2 결제 연동 유틸리티

export interface PaymentRequest {
  orderName: string;
  amount: number;
  orderId: string;
  customerEmail: string;
  customerName: string;
}

export interface PaymentResult {
  txId: string;
  paymentId: string;
  status: "PAID" | "FAILED" | "CANCELLED";
}

// 서버에서 결제 검증
export async function verifyPayment(paymentId: string): Promise<boolean> {
  const apiSecret = process.env.PORTONE_API_SECRET;
  if (!apiSecret) {
    throw new Error("PORTONE_API_SECRET 환경변수가 설정되지 않았습니다.");
  }

  // PortOne V2 API로 결제 내역 조회
  const response = await fetch(
    `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
    {
      headers: {
        Authorization: `PortOne ${apiSecret}`,
      },
    }
  );

  if (!response.ok) {
    return false;
  }

  const data = await response.json();
  return data.status === "PAID";
}

// 결제 취소 (환불)
export async function cancelPayment(
  paymentId: string,
  reason: string
): Promise<boolean> {
  const apiSecret = process.env.PORTONE_API_SECRET;
  if (!apiSecret) {
    throw new Error("PORTONE_API_SECRET 환경변수가 설정되지 않았습니다.");
  }

  const response = await fetch(
    `https://api.portone.io/payments/${encodeURIComponent(paymentId)}/cancel`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `PortOne ${apiSecret}`,
      },
      body: JSON.stringify({ reason }),
    }
  );

  return response.ok;
}
