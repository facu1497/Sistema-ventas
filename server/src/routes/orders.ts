import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        client: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// Create new order (Reservation)
router.post('/', async (req, res) => {
  try {
    const { client, items } = req.body;
    // items: [{ productId, quantity, price }]
    // client: { name, phone, email?, instagram? }

    // Use transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Find or create client
      let dbClient = await tx.client.findFirst({
        where: { phone: client.phone }
      });
      if (!dbClient) {
        dbClient = await tx.client.create({
          data: {
            name: client.name,
            phone: client.phone,
            email: client.email,
            instagram: client.instagram
          }
        });
      }

      // 2. Validate stock
      let total = 0;
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product || product.stockQuantity < item.quantity) {
          throw new Error(`Insufficient stock for product ${product?.name || item.productId}`);
        }
        total += item.quantity * item.price;
      }

      // 3. Create order
      const order = await tx.order.create({
        data: {
          clientId: dbClient.id,
          total,
          status: 'PENDING',
          items: {
            create: items.map((i: any) => ({
              productId: i.productId,
              quantity: i.quantity,
              price: i.price
            }))
          }
        },
        include: {
          items: true,
          client: true,
        }
      });

      return order;
    });

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // APPROVED or REJECTED

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: { items: true }
      });

      if (!order) throw new Error('Order not found');
      if (order.status !== 'PENDING') throw new Error('Order is already processed');

      // Update order status
      const updatedOrder = await tx.order.update({
        where: { id },
        data: { status }
      });

      // If approved, deduct stock
      if (status === 'APPROVED') {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: {
                decrement: item.quantity
              }
            }
          });
        }
      }

      return updatedOrder;
    });

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
