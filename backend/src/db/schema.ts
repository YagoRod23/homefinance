import { pgTable, text, serial, integer, decimal, timestamp, boolean, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Residents table
export const residents = pgTable('residents', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Incomes table
export const incomes = pgTable('incomes', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull(),
  description: varchar('description', { length: 500 }).notNull(),
  value: decimal('value', { precision: 10, scale: 2 }).notNull(),
  date: timestamp('date').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Expenses table
export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull(),
  description: varchar('description', { length: 500 }).notNull(),
  value: decimal('value', { precision: 10, scale: 2 }).notNull(),
  date: timestamp('date').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  type: varchar('type', { length: 50 }).notNull().default('variable'), // fixed or variable
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Expense shares table
export const expense_shares = pgTable('expense_shares', {
  id: serial('id').primaryKey(),
  expense_id: integer('expense_id').notNull(),
  resident_id: integer('resident_id').notNull(),
  share_value: decimal('share_value', { precision: 10, scale: 2 }).notNull(),
  is_settled: boolean('is_settled').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Debts table (optional for MVP)
export const debts = pgTable('debts', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull(),
  description: varchar('description', { length: 500 }).notNull(),
  total_value: decimal('total_value', { precision: 10, scale: 2 }).notNull(),
  start_date: timestamp('start_date').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Payments table (optional for MVP)
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  debt_id: integer('debt_id').notNull(),
  value: decimal('value', { precision: 10, scale: 2 }).notNull(),
  due_date: timestamp('due_date').notNull(),
  paid_at: timestamp('paid_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  residents: many(residents),
  incomes: many(incomes),
  expenses: many(expenses),
  debts: many(debts),
}));

export const residentsRelations = relations(residents, ({ one, many }) => ({
  user: one(users, { fields: [residents.user_id], references: [users.id] }),
  shares: many(expense_shares),
}));

export const expensesRelations = relations(expenses, ({ one, many }) => ({
  user: one(users, { fields: [expenses.user_id], references: [users.id] }),
  shares: many(expense_shares),
}));

export const expenseSharesRelations = relations(expense_shares, ({ one }) => ({
  expense: one(expenses, { fields: [expense_shares.expense_id], references: [expenses.id] }),
  resident: one(residents, { fields: [expense_shares.resident_id], references: [residents.id] }),
}));
