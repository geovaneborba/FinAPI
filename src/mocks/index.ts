export type Customers = Array<{
  id?: string;
  cpf: string;
  name: string;
  statements: {
    description?: string;
    amount?: number;
    type?: string;
    created_at?: Date;
  }[];
}>;

export const customers: Customers = [];
