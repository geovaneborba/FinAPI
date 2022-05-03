import { Router } from "express";
import { customers } from "../mocks";
import { v4 as uuid } from "uuid";
import { verifyExistsAccountCPF } from "../middlewares/verifyExistsAccountCPF";

const routes = Router();

// Criar a conta
routes.post("/account", (request, response) => {
  const { cpf, name } = request.body;

  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlreadyExists) {
    return response.status(400).json({ error: "Customer already exists!" });
  }

  const customer = {
    id: uuid(),
    cpf,
    name,
    statements: [],
  };

  customers.push(customer);

  return response.status(201).send();
});

// Atualizar a conta
routes.put("/account", verifyExistsAccountCPF, (request, response) => {
  const { customer } = request;
  const { name } = request.body;

  customer.name = name;

  return response.status(201).send();
});

// Visualizar a conta
routes.get("/account", verifyExistsAccountCPF, (request, response) => {
  const { customer } = request;

  return response.status(200).json(customer);
});

// Exibir todas contas
routes.get("/all/account", verifyExistsAccountCPF, (request, response) => {
  const allAccounts = customers.map((customer) => customer);

  return response.status(200).json(allAccounts);
});

// Deletar a conta
routes.delete("/account/:cpf", verifyExistsAccountCPF, (request, response) => {
  const { cpf } = request.params;

  // Encontra o index do cliente pelo cpf
  const customerIndex = customers.findIndex((customer) => customer.cpf === cpf);

  // Caso o cliente não exista retorna um erro
  if (customerIndex === -1) {
    return response.status(400).json({ error: "Customer not found!" });
  }

  // Se chegou até aqui, então o cliente existe
  // Remove o cliente do array
  customers.splice(customerIndex, 1);

  return response.status(200).json(customers);
});

// Obtem o saldo da conta
routes.get("/balance", verifyExistsAccountCPF, (request, response) => {
  const { customer } = request;

  const balance = customer.statements.reduce((acc, operation) => {
    return operation.type === "credit"
      ? acc + operation.amount!!
      : acc - operation.amount!!;
  }, 0);

  return response.status(200).json({ balance });
});

// Realiza um depósito na conta
routes.post("/deposit", verifyExistsAccountCPF, (request, response) => {
  const { customer } = request;
  const { description, amount } = request.body;

  const statemenetOperation = {
    description,
    amount,
    type: "credit",
    created_at: new Date(),
  };

  customer.statements.push(statemenetOperation);

  return response.status(201).send();
});

// Realiza um saque na conta
routes.post("/withdraw", verifyExistsAccountCPF, (request, response) => {
  const { amount } = request.body;
  const { customer } = request;

  const balance = customer.statements.reduce((acc, operation) => {
   /**
    * Caso o tipo de operação seja credito, então o acc que é o acumulador recebe 0
    * Logo o acumulador é somado com o valor do credito
    * Caso o tipo de operação seja debito, 
    * então o acumulador recebe o valor do debito e é subtraído do valor do debito
    */
    return operation.type === "credit"
      ? acc + operation.amount!!
      : acc - operation.amount!!;
  }, 0);

  /**
   * Caso o saldo do cliente seja menor que o valor do saque, retorna um erro
   **/
  if (balance < amount) {
    return response.status(400).json({ error: "Insufficient funds!" });
  }

  /**
   * Cria uma nova operação de débito com o valor do saque
   */
  const statementOperation = {
    amount,
    created_at: new Date(),
    type: "debit",
  };

  /**
   * Adiciona a operação de débito na lista de operações do cliente
   */
  customer.statements.push(statementOperation);

  return response.status(201).send();
});

routes.get("/statements", verifyExistsAccountCPF, (request, response) => {
  const customer = request.customer;

  return response.json(customer.statements);
});

routes.get("/statements/date", verifyExistsAccountCPF, (request, response) => {
  const customer = request.customer;
  const { date } = request.query;

  const findStatementsByDate = customer.statements.filter((statement) => {
    const year = statement.created_at?.getFullYear();
    const month = statement.created_at?.getMonth().toString().padStart(2, "0");
    const day = statement.created_at?.getDate().toString().padStart(2, "0");

    const dateFormatted = `${year}-${month}-${day}`;

    return dateFormatted == date;
  });

  if (findStatementsByDate.length === 0) {
    return response
      .status(400)
      .json({ error: "No statements found on this date" });
  }

  return response.status(201).json(findStatementsByDate);
});

export default routes;
