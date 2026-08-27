import Link from 'next/link';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default async function PropertiesPage() {
  const session = await requireSession();

  const properties = await prisma.property.findMany({
    where: { ownerId: session.user.id },
    include: { _count: { select: { contracts: true } } },
    orderBy: { createdAt: 'desc' },
  });

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-muted-foreground">Nenhum imóvel cadastrado ainda.</p>
          <Button asChild>
            <Link href="/dashboard/properties/new">Cadastrar imóvel</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Label</TableHead>
          <TableHead>Endereço</TableHead>
          <TableHead>Contratos</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {properties.map((property) => (
          <TableRow key={property.id}>
            <TableCell>{property.label}</TableCell>
            <TableCell>
              {property.addressStreet}, {property.addressNumber} - {property.addressCity}/
              {property.addressState}
            </TableCell>
            <TableCell>{property._count.contracts}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
