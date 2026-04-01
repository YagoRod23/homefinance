import { db } from '../db/client.js';
import { residents } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

export interface CreateResidentInput {
  user_id: number;
  name: string;
  email?: string;
}

export interface UpdateResidentInput {
  name?: string;
  email?: string;
}

export class ResidentService {
  /**
   * Criar novo morador
   */
  static async createResident(input: CreateResidentInput) {
    try {
      // Validar entrada
      if (!input.user_id || !input.name) {
        throw new Error('Missing required fields: user_id, name');
      }

      const result = await db.insert(residents).values({
        user_id: input.user_id,
        name: input.name,
        email: input.email || null,
      }).returning();

      return result[0];
    } catch (error: any) {
      throw new Error(`Failed to create resident: ${error.message}`);
    }
  }

  /**
   * Obter morador por ID
   */
  static async getResidentById(residentId: number, userId: number) {
    try {
      const result = await db
        .select()
        .from(residents)
        .where(and(eq(residents.id, residentId), eq(residents.user_id, userId)));

      if (!result.length) {
        throw new Error('Resident not found');
      }

      return result[0];
    } catch (error: any) {
      throw new Error(`Failed to get resident: ${error.message}`);
    }
  }

  /**
   * Obter todos os moradores do usuário
   */
  static async getResidentsByUser(userId: number, limit = 50, offset = 0) {
    try {
      const result = await db
        .select()
        .from(residents)
        .where(eq(residents.user_id, userId))
        .limit(limit)
        .offset(offset);

      return result;
    } catch (error: any) {
      throw new Error(`Failed to get residents: ${error.message}`);
    }
  }

  /**
   * Atualizar morador
   */
  static async updateResident(residentId: number, userId: number, input: UpdateResidentInput) {
    try {
      // Verificar se morador pertence ao usuário
      const existingResident = await this.getResidentById(residentId, userId);
      if (!existingResident) {
        throw new Error('Resident not found');
      }

      const updateData: any = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.email !== undefined) updateData.email = input.email || null;

      const result = await db
        .update(residents)
        .set({
          ...updateData,
          updated_at: new Date(),
        })
        .where(eq(residents.id, residentId))
        .returning();

      return result[0];
    } catch (error: any) {
      throw new Error(`Failed to update resident: ${error.message}`);
    }
  }

  /**
   * Deletar morador
   */
  static async deleteResident(residentId: number, userId: number) {
    try {
      // Verificar se morador pertence ao usuário
      const existingResident = await this.getResidentById(residentId, userId);
      if (!existingResident) {
        throw new Error('Resident not found');
      }

      await db.delete(residents).where(eq(residents.id, residentId));

      return { success: true };
    } catch (error: any) {
      throw new Error(`Failed to delete resident: ${error.message}`);
    }
  }
}
