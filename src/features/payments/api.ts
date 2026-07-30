import { getSupabaseClientOrThrow } from "@/services/supabase";

export type MobileMoneyOperator = "MTN" | "Vodafone" | "Tigo";

type PaymentRecord = {
  id: string;
  request_id?: string | null;
  household_id?: string | null;
  operator: MobileMoneyOperator;
  phone: string;
  amount: number;
  status: string;
  created_at?: string;
};

export async function initiateMobileMoneyPayment(payload: {
  requestId?: string;
  householdId?: string;
  operator: MobileMoneyOperator;
  phone: string;
  amount: number;
}) {
  const supabase = getSupabaseClientOrThrow();

  try {
    const { data, error } = await supabase
      .from("payments")
      .insert({
        request_id: payload.requestId ?? null,
        household_id: payload.householdId ?? null,
        operator: payload.operator,
        phone: payload.phone,
        amount: payload.amount,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;
    return data as PaymentRecord;
  } catch (err) {
    // If payments table doesn't exist or network error, return a local stub so UI can proceed.
    return {
      id: `local-${Date.now()}`,
      request_id: payload.requestId ?? null,
      household_id: payload.householdId ?? null,
      operator: payload.operator,
      phone: payload.phone,
      amount: payload.amount,
      status: "pending",
      created_at: new Date().toISOString(),
    } as PaymentRecord;
  }
}
