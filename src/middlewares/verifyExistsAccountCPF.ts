import { NextFunction, Request, Response } from "express"
import { customers } from "../mocks"

 export function verifyExistsAccountCPF(request: Request, response: Response, next: NextFunction) {
  const { cpf } = request.headers

  const costumerFound = customers.find(costumer => costumer.cpf === cpf)

  if(!costumerFound) {
    return response.status(400).json({ error: 'Customer not found!' })
  }

  request.customer = costumerFound

  return next()
}