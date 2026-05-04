declare module "@paystack/inline-js" {
  type PaystackSuccessTransaction = {
    reference?: string;
    trxref?: string;
    trans?: string;
    transaction?: string;
    status?: string;
    message?: string;
  };

  type PaystackCallbacks = {
    onSuccess?: (transaction: PaystackSuccessTransaction) => void | Promise<void>;
    onCancel?: () => void;
    onError?: (error: { message?: string }) => void;
    onLoad?: (response: { id?: string | number; accessCode?: string; customer?: unknown }) => void;
    onElementsMount?: (elements: unknown) => void;
  };

  type PaystackTransactionOptions = PaystackCallbacks & {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    customerCode?: string;
    channels?: string[];
    metadata?: Record<string, unknown>;
    reference?: string;
    container?: string;
    loadPaystackCheckoutButton?: string;
    styles?: Record<string, unknown>;
    subaccountCode?: string;
    split_code?: string;
    bearer?: string;
    transactionCharge?: number;
    planInterval?: string;
    subscriptionLimit?: number;
    subscriptionStartDate?: string;
  };

  class PaystackPop {
    constructor();
    static isLoaded(): boolean;
    newTransaction(options: PaystackTransactionOptions): unknown;
    checkout(options: PaystackTransactionOptions): Promise<unknown>;
    resumeTransaction(accessCode: string, callbacks?: PaystackCallbacks): unknown;
    cancelTransaction(id: string | { id?: string }): void;
    preloadTransaction(options: PaystackTransactionOptions): () => void;
    paymentRequest(options: PaystackTransactionOptions & { container: string }): Promise<unknown>;
  }

  export default PaystackPop;
}
