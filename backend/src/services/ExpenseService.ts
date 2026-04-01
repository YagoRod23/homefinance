import { db } from '../db/client.js';
import { expenses, expense_shares, residents } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

export interface CreateExpenseInput {
  user_id: number;
  description: string;
  value: string | number;
  date: Date | string;
  category: string;
  type?: 'fixed' | 'variable';
  resident_ids?: number[]; // IDs dos moradores que compartilham a despesa
}

export interface UpdateExpenseInput {
  description?: string;
  value?: string | number;
  date?: Date | string;
  category?: string;
  type?: 'fixed' | 'variable';
}

export class ExpenseService {
  /**
   * Criar nova despesa com divisão automática
   * Se resident_ids for fornecido, divide a despesa igualmente entre eles
   */
  static async createExpense(input: CreateExpenseInput) {
    try {
      // Validar entrada
      if (!input.user_id || !input.description || !input.value || !input.date || !input.category) {
        throw new Error('Missing required fields: user_id, description, value, date, category');
      }

      const value = parseFloat(String(input.value));
      if (isNaN(value) || value <= 0) {
        throw new Error('Value must be a positive number');
      }

      // Inserir despesa
      const result = await db.insert(expenses).values({
        user_id: input.user_id,
        description: input.description,
        value: String(value),
        date: new Date(input.date),
        category: input.category,
        type: input.type || 'variable',
      }).returning();

      const expense = result[0];

      // Se resident_ids fornecido, criar shares
      if (input.resident_ids && input.resident_ids.length > 0) {
        await this.createExpenseShares(expense.id, input.resident_ids, value);
      }

      return {
        ...expense,
        value: parseFloat(String(expense.value)),
      };
    } catch (error: any) {
      throw new Error(`Failed to create expense: ${error.message}`);
    }
  }

  /**
   * Criar divisão automática de despesa entre moradores
   */
  private static async createExpenseShares(expenseId: number, residentIds: number[], totalValue: number) {
    const shareValue = parseFloat((totalValue / residentIds.length).toFixed(2));

    const shares = residentIds.map(residentId => ({
      expense_id: expenseId,
      resident_id: residentId,
      share_value: String(shareValue),
      is_settled: false,
    }));

    await db.insert(expense_shares).values(shares);
  }

  /**
   * Obter despesa por ID com seus shares
   */
  static async getExpenseById(expenseId: number, userId: number) {
    try {
      const result = await db
        .select()
        .from(expenses)
        .where(and(eq(expenses.id, expenseId), eq(expenses.user_id, userId)));

      if (!result.length) {
        throw new Error('Expense not found');
      }

      const expense = result[0];

      // Obter shares
      const shares = await db
        .select()
        .from(expense_shares)
        .where(eq(expense_shares.expense_id, expenseId));

      return {
        ...expense,
        value: parseFloat(String(expense.value)),
        shares: shares.map(share => ({
          ...share,
          share_value: parseFloat(String(share.share_value)),
        })),
      };
    } catch (error: any) {
      throw new Error(`Failed to get expense: ${error.message}`);
    }
  }

  /**
   * Obter todas as despesas do usuário
   */
  static async getExpensesByUser(userId: number, limit = 50, offset = 0) {
    try {
      const result = await db
        .select()
        .from(expenses)
        .where(eq(expenses.user_id, userId))
        .orderBy(expenses.date)
        .limit(limit)
        .offset(offset);

      return result.map(expense => ({
        ...expense,
        value: parseFloat(String(expense.value)),
      }));
    } catch (error: any) {
      throw new Error(`Failed to get expenses: ${error.message}`);
    }
  }

  /**
   * Atualizar despesa
   */
  static async updateExpense(expenseId: number, userId: number, input: UpdateExpenseInput) {
    try {
      // Verificar se despesa pertence ao usuário
      const existingExpense = await this.getExpenseById(expenseId, userId);
      if (!existingExpense) {
        throw new Error('Expense not found');
      }

      const updateData: any = {};
      if (input.description !== undefined) updateData.description = input.description;
      if (input.value !== undefined) updateData.value = String(input.value);
      if (input.date !== undefined) updateData.date = new Date(input.date);
      if (input.category !== undefined) updateData.category = input.category;
      if (input.type !== undefined) updateData.type = input.type;

      const result = await db
        .update(expenses)
        .set({
          ...updateData,
          updated_at: new Date(),
        })
        .where(eq(expenses.id, expenseId))
        .returning();

      return {
        ...result[0],
        value: parseFloat(String(result[0].value)),
      };
    } catch (error: any) {
      throw new Error(`Failed to update expense: ${error.message}`);
    }
  }

  /**
   * Deletar despesa (e suas shares)
   */
  static async deleteExpense(expenseId: number, userId: number) {
    try {
      // Verificar se despesa pertence ao usuário
      const existingExpense = await db
        .select()
        .from(expenses)
        .where(and(eq(expenses.id, expenseId), eq(expenses.user_id, userId)));

      if (!existingExpense.length) {
        throw new Error('Expense not found');
      }

      // Deletar shares
      await db.delete(expense_shares).where(eq(expense_shares.expense_id, expenseId));

      // Deletar despesa
      await db.delete(expenses).where(eq(expenses.id, expenseId));

      return { success: true };
    } catch (error: any) {
      throw new Error(`Failed to delete expense: ${error.message}`);
    }
  }
}
