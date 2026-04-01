import api from './api';

export interface Resident {
  id: number;
  name: string;
  email?: string;
}

export const residentService = {
  async listResidents(limit = 50, offset = 0): Promise<Resident[]> {
    const response = await api.get('/residents', { params: { limit, offset } });
    return response.data;
  },

  async getResident(id: number): Promise<Resident> {
    const response = await api.get(`/residents/${id}`);
    return response.data;
  },

  async createResident(data: {
    name: string;
    email?: string;
  }): Promise<Resident> {
    const response = await api.post('/residents', data);
    return response.data;
  },

  async updateResident(
    id: number,
    data: Partial<Omit<Resident, 'id'>>
  ): Promise<Resident> {
    const response = await api.put(`/residents/${id}`, data);
    return response.data;
  },

  async deleteResident(id: number): Promise<{ success: boolean }> {
    const response = await api.delete(`/residents/${id}`);
    return response.data;
  },
};
