declare namespace Express {
  export interface Request {
    customer: {
      id?: string
      cpf: string
      name: string
      statements: { 
        description?: string,
        amount?: number,
        type?: string,
        created_at?: Date 
      }[];
    };
  }
}
