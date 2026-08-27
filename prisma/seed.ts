import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function monthsAgo(n: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d;
}
const monthsFromNow = (n: number) => monthsAgo(-n);
function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

async function main() {
  const owner = await prisma.user.upsert({
    where: { email: 'proprietario@renteasy.dev' },
    update: {},
    create: {
      id: 'seed-user-1',
      email: 'proprietario@renteasy.dev',
      name: 'Carlos Mendes',
      personType: 'PF',
      document: '12345678901',
    },
  });

  const property1 = await prisma.property.upsert({
    where: { id: 'seed-property-1' },
    update: {},
    create: {
      id: 'seed-property-1',
      ownerId: owner.id,
      label: 'Apartamento Centro',
      addressStreet: 'Rua das Flores',
      addressNumber: '123',
      addressComplement: 'Apto 45',
      addressNeighborhood: 'Centro',
      addressCity: 'Florianópolis',
      addressState: 'SC',
      addressZip: '88010-000',
    },
  });

  const property2 = await prisma.property.upsert({
    where: { id: 'seed-property-2' },
    update: {},
    create: {
      id: 'seed-property-2',
      ownerId: owner.id,
      label: 'Casa Jardim das Palmeiras',
      addressStreet: 'Av. Paulista',
      addressNumber: '456',
      addressComplement: null,
      addressNeighborhood: 'Bela Vista',
      addressCity: 'São Paulo',
      addressState: 'SP',
      addressZip: '01310-000',
    },
  });

  const tenant1 = await prisma.tenant.upsert({
    where: { id: 'seed-tenant-1' },
    update: {},
    create: {
      id: 'seed-tenant-1',
      ownerId: owner.id,
      name: 'Juliana Alves',
      document: '98765432100',
      email: 'juliana.alves@example.com',
      phone: '48999990001',
    },
  });

  const tenant2 = await prisma.tenant.upsert({
    where: { id: 'seed-tenant-2' },
    update: {},
    create: {
      id: 'seed-tenant-2',
      ownerId: owner.id,
      name: 'Roberto Santos',
      document: null,
      email: 'roberto.santos@example.com',
      phone: '48999990002',
    },
  });

  const oldBase = monthsAgo(14);
  const contract1 = await prisma.contract.upsert({
    where: { id: 'seed-contract-1' },
    update: {},
    create: {
      id: 'seed-contract-1',
      propertyId: property1.id,
      tenantId: tenant1.id,
      ownerId: owner.id,
      rentValue: 2500,
      adjustmentIndex: 'IGPM',
      baseDate: oldBase,
      startDate: oldBase,
      status: 'ACTIVE',
    },
  });

  const recentBase = monthsAgo(3);
  const contract2 = await prisma.contract.upsert({
    where: { id: 'seed-contract-2' },
    update: {},
    create: {
      id: 'seed-contract-2',
      propertyId: property2.id,
      tenantId: tenant2.id,
      ownerId: owner.id,
      rentValue: 1800,
      adjustmentIndex: 'IPCA',
      baseDate: recentBase,
      startDate: recentBase,
      status: 'ACTIVE',
    },
  });

  const upsertPayment = (
    contractId: string,
    dueDate: Date,
    amount: number,
    status: 'PAID' | 'UPCOMING' | 'LATE',
    paidAt: Date | null,
  ) =>
    prisma.payment.upsert({
      where: { contractId_dueDate: { contractId, dueDate } },
      update: {},
      create: { contractId, dueDate, amount, status, paidAt },
    });

  await upsertPayment(contract1.id, monthsAgo(2), 2500, 'PAID', monthsAgo(2));
  await upsertPayment(contract1.id, monthsAgo(1), 2500, 'LATE', null);
  await upsertPayment(contract1.id, monthsFromNow(1), 2500, 'UPCOMING', null);

  await upsertPayment(contract2.id, monthsAgo(1), 1800, 'PAID', monthsAgo(1));
  await upsertPayment(contract2.id, daysFromNow(5), 1800, 'UPCOMING', null);
  await upsertPayment(contract2.id, monthsFromNow(1), 1800, 'UPCOMING', null);

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
