import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import bcryptjs from 'bcryptjs';
import * as schema from './db/schema.js';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/homefinance',
});

const db = drizzle(pool, { schema });

async function seed() {
  try {
    console.log('🌱 Iniciando seed de dados de teste...\n');

    // 1. Criar usuário de teste
    const hashedPassword = await bcryptjs.hash('senha123', 10);
    
    const user = await db
      .insert(schema.users)
      .values({
        email: 'teste@exemplo.com',
        password_hash: hashedPassword,
        name: 'Usuário Teste',
      })
      .returning()
      .then(rows => rows[0]);

    console.log('✅ Usuário criado:');
    console.log(`   Email: teste@exemplo.com`);
    console.log(`   Senha: senha123`);
    console.log(`   ID: ${user.id}\n`);

    // 2. Criar moradores de teste
    const residents = await db
      .insert(schema.residents)
      .values([
        { user_id: user.id, name: 'João Silva', email: 'joao@exemplo.com' },
        { user_id: user.id, name: 'Maria Santos', email: 'maria@exemplo.com' },
        { user_id: user.id, name: 'Pedro Costa', email: 'pedro@exemplo.com' },
      ])
      .returning();

    console.log('✅ Moradores criados:');
    residents.forEach((r, i) => {
      console.log(`   ${i + 1}. ${r.name} (ID: ${r.id})`);
    });
    console.log();

    // 3. Criar receitas de teste
    const incomes = await db
      .insert(schema.incomes)
      .values([
        {
          user_id: user.id,
          description: 'Salário',
          value: '3500.00',
          date: new Date('2026-04-01'),
          category: 'Salário',
        },
        {
          user_id: user.id,
          description: 'Freelance',
          value: '800.00',
          date: new Date('2026-04-05'),
          category: 'Freelance',
        },
      ])
      .returning();

    console.log('✅ Receitas criadas:');
    incomes.forEach((inc, i) => {
      console.log(`   ${i + 1}. ${inc.description}: R$ ${inc.value}`);
    });
    console.log();

    // 4. Criar despesas de teste
    const expenses = await db
      .insert(schema.expenses)
      .values([
        {
          user_id: user.id,
          description: 'Aluguel',
          value: '1200.00',
          date: new Date('2026-04-01'),
          category: 'Moradia',
          type: 'fixed',
        },
        {
          user_id: user.id,
          description: 'Supermercado',
          value: '250.50',
          date: new Date('2026-04-02'),
          category: 'Alimentação',
          type: 'variable',
        },
        {
          user_id: user.id,
          description: 'Conta de Luz',
          value: '85.00',
          date: new Date('2026-04-03'),
          category: 'Utilidades',
          type: 'fixed',
        },
        {
          user_id: user.id,
          description: 'Cinema',
          value: '60.00',
          date: new Date('2026-04-04'),
          category: 'Entretenimento',
          type: 'variable',
        },
      ])
      .returning();

    console.log('✅ Despesas criadas:');
    expenses.forEach((exp, i) => {
      console.log(`   ${i + 1}. ${exp.description}: R$ ${exp.value} (${exp.type})`);
    });
    console.log();

    // 5. Criar compartilhamentos de despesas
    const shares = await db
      .insert(schema.expense_shares)
      .values([
        // Aluguel dividido em 3
        { expense_id: expenses[0].id, resident_id: residents[0].id, share_value: '400.00' },
        { expense_id: expenses[0].id, resident_id: residents[1].id, share_value: '400.00' },
        { expense_id: expenses[0].id, resident_id: residents[2].id, share_value: '400.00' },
        // Supermercado dividido em 3
        { expense_id: expenses[1].id, resident_id: residents[0].id, share_value: '83.50' },
        { expense_id: expenses[1].id, resident_id: residents[1].id, share_value: '83.50' },
        { expense_id: expenses[1].id, resident_id: residents[2].id, share_value: '83.50' },
        // Conta de Luz em João
        { expense_id: expenses[2].id, resident_id: residents[0].id, share_value: '85.00' },
        // Cinema em Maria
        { expense_id: expenses[3].id, resident_id: residents[1].id, share_value: '60.00' },
      ])
      .returning();

    console.log('✅ Compartilhamentos de despesas criados:');
    console.log(`   Total: ${shares.length} distribuições\n`);

    // 6. Resumo
    console.log('📊 RESUMO DOS DADOS DE TESTE:\n');
    console.log('🔐 Acesso:');
    console.log('   Email: teste@exemplo.com');
    console.log('   Senha: senha123\n');
    
    console.log('👥 Household:');
    console.log(`   ${residents.length} Moradores`);
    console.log(`   ${expenses.length} Despesas (${shares.length} compartilhadas)`);
    console.log(`   ${incomes.length} Receitas\n`);

    console.log('💰 Financeiro:');
    const totalIncome = incomes.reduce((sum, inc) => sum + parseFloat(inc.value), 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.value), 0);
    console.log(`   Total Receitas: R$ ${totalIncome.toFixed(2)}`);
    console.log(`   Total Despesas: R$ ${totalExpenses.toFixed(2)}`);
    console.log(`   Saldo: R$ ${(totalIncome - totalExpenses).toFixed(2)}\n`);

    console.log('✨ Seed concluído com sucesso!');
    console.log('🚀 Você já pode fazer login com os dados acima.\n');

  } catch (error) {
    console.error('❌ Erro durante seed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
