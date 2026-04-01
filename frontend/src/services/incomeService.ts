import api from './api';

export interface Income {
  id: number;
  description: string;
  value: number;
  date: string;
  category: string;
}

export const incomeService = {
  async listIncomes(limit = 50, offset = 0): Promise<Income[]> {
    const response = await api.get('/incomes', { params: { limit, offset } });
    return response.data;
  },

  async getIncome(id: number): Promise<Income> {
    const response = await api.get(`/incomes/${id}`);
    return response.data;
  },

  async createIncome(data: {
    description: string;
    value: number | string;
    date: string;
    category: string;
  }): Promise<Income> {
    const response = await api.post('/incomes', data);
    return response.data;
  },

  async updateIncome(
    id: number,
    data: Partial<Omit<Income, 'id'>>
  ): Promise<Income> {
    const response = await api.put(`/incomes/${id}`, data);
    return response.data;
  },

  async deleteIncome(id: number): Promise<{ success: boolean }> {
    const response = await api.delete(`/incomes/${id}`);
    return response.data;
  },
};
