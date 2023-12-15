export interface ITransactionParams {
  id: string;
  salt: string;
  source: string;
  actions: ITransactionAction[];
  metadata: string;
  avoNonce: string;
}

export interface ITransactionAction {
  target: string;
  data: string;
  value: string;
  operation: string;
}

export interface ITransactionForwardParams {
  gas: string;
  gasPrice: string;
  validAfter: string;
  validUntil: string;
  value: string;
}

export interface ITransactionPayload {
  params: ITransactionParams;
  forwardParams: ITransactionForwardParams;
}

export interface IEstimatedFeeData {
  fee: string; // estimated total gas fee in USDC (in 10**18 and hex!!)
  multiplier: string; // in hex! fee divided by multiplier (fee / multiplier) will give the absolute minimum expected fee amount
  discount: IEstimatedDiscount;
}

export interface IEstimatedDiscount {
  amount: number;
  transactionCount: number;
  program: string;
  name: string;
  description: string;
}
