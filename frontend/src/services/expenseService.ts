import api from './api';

export interface Expense {
  id: number;
  description: string;
  value: number;
  date: string;
  category: string;
  type: 'fixed' | 'variable';
  shares?: ExpenseShare[];
}

export interface ExpenseShare {
  id: number;
  resident_id: number;
  share_value: number;
  is_settled: boolean;
}

export const expenseService = {
  async listExpenses(limit = 50, offset = 0): Promise<Expense[]> {
    const response = await api.get('/expenses', { params: { limit, offset } });
    return response.data;
  },

  async getExpense(id: number): Promise<Expense> {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  async createExpense(data: {
    description: string;
    value: number | string;
    date: string;
    category: string;
    type?: 'fixed' | 'variable';
    resident_ids?: number[];
  }): Promise<Expense> {
    const response = await api.post('/expenses', data);
    return response.data;
  },

  async updateExpense(
    id: number,
    data: Partial<Omit<Expense, 'id'>>
  ): Promise<Expense> {
    const response = await api.put(`/expenses/${id}`, data);
    return response.data;
  },

  async deleteExpense(id: number): Promise<{ success: boolean }> {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },
};
