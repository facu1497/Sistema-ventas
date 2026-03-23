import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Create product
router.post('/', async (req, res) => {
  try {
    const { name, description, price, stockQuantity } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price, stockQuantity }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error creating product' });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stockQuantity } = req.body;
    const product = await prisma.product.update({
      where: { id },
      data: { name, description, price, stockQuantity }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error updating product' });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product' });
  }
});

export default router;
