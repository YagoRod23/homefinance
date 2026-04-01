import { db } from '../db/client.js';
import { incomes } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export interface CreateIncomeInput {
  user_id: number;
  description: string;
  value: string | number;
  date: Date | string;
  category: string;
}

export interface UpdateIncomeInput {
  description?: string;
  value?: string | number;
  date?: Date | string;
  category?: string;
}

export class IncomeService {
  /**
   * Criar nova receita
   */
  static async createIncome(input: CreateIncomeInput) {
    try {
      // Validar entrada
      if (!input.user_id || !input.description || !input.value || !input.date || !input.category) {
        throw new Error('Missing required fields: user_id, description, value, date, category');
      }

      const value = parseFloat(String(input.value));
      if (isNaN(value) || value <= 0) {
        throw new Error('Value must be a positive number');
      }

      const result = await db.insert(incomes).values({
        user_id: input.user_id,
        description: input.description,
        value: String(value),
        date: new Date(input.date),
        category: input.category,
      }).returning();

      return {
        ...result[0],
        value: parseFloat(String(result[0].value)),
      };
    } catch (error: any) {
      throw new Error(`Failed to create income: ${error.message}`);
    }
  }

  /**
   * Obter receita por ID
   */
  static async getIncomeById(incomeId: number, userId: number) {
    try {
      const result = await db
        .select()
        .from(incomes)
        .where(eq(incomes.id, incomeId));

      if (!result.length || result[0].user_id !== userId) {
        throw new Error('Income not found');
      }

      return {
        ...result[0],
        value: parseFloat(String(result[0].value)),
      };
    } catch (error: any) {
      throw new Error(`Failed to get income: ${error.message}`);
    }
  }

  /**
   * Obter todas as receitas do usuário
   */
  static async getIncomesByUser(userId: number, limit = 50, offset = 0) {
    try {
      const result = await db
        .select()
        .from(incomes)
        .where(eq(incomes.user_id, userId))
        .orderBy(incomes.date)
        .limit(limit)
        .offset(offset);

      return result.map(income => ({
        ...income,
        value: parseFloat(String(income.value)),
      }));
    } catch (error: any) {
      throw new Error(`Failed to get incomes: ${error.message}`);
    }
  }

  /**
   * Atualizar receita
   */
  static async updateIncome(incomeId: number, userId: number, input: UpdateIncomeInput) {
    try {
      // Verificar se receita pertence ao usuário
      const existingIncome = await this.getIncomeById(incomeId, userId);
      if (!existingIncome) {
        throw new Error('Income not found');
      }

      const updateData: any = {};
      if (input.description !== undefined) updateData.description = input.description;
      if (input.value !== undefined) updateData.value = String(input.value);
      if (input.date !== undefined) updateData.date = new Date(input.date);
      if (input.category !== undefined) updateData.category = input.category;

      const result = await db
        .update(incomes)
        .set({
          ...updateData,
          updated_at: new Date(),
        })
        .where(eq(incomes.id, incomeId))
        .returning();

      return {
        ...result[0],
        value: parseFloat(String(result[0].value)),
      };
    } catch (error: any) {
      throw new Error(`Failed to update income: ${error.message}`);
    }
  }

  /**
   * Deletar receita
   */
  static async deleteIncome(incomeId: number, userId: number) {
    try {
      // Verificar se receita pertence ao usuário
      const existingIncome = await this.getIncomeById(incomeId, userId);
      if (!existingIncome) {
        throw new Error('Income not found');
      }

      await db.delete(incomes).where(eq(incomes.id, incomeId));

      return { success: true };
    } catch (error: any) {
      throw new Error(`Failed to delete income: ${error.message}`);
    }
  }
}
