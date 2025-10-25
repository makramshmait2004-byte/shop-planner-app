import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication to all shopping routes
router.use(authenticateToken);

// Get current week's shopping list
router.get('/:familyId/current', async (req, res) => {
  try {
    const { familyId } = req.params;

    // Verify user belongs to this family
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user || user.familyId !== familyId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get current Saturday
    const now = new Date();
    const currentSaturday = getSaturday(now);

    let shoppingList = await prisma.shoppingList.findFirst({
      where: {
        familyId,
        weekStart: currentSaturday,
        isArchived: false
      },
      include: {
        items: {
          include: {
            addedBy: {
              select: {
                id: true,
                fullName: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    // If no current list exists, create one
    if (!shoppingList) {
      const nextSaturday = new Date(currentSaturday);
      nextSaturday.setDate(nextSaturday.getDate() + 7);

      shoppingList = await prisma.shoppingList.create({
        data: {
          familyId,
          weekStart: currentSaturday,
          weekEnd: nextSaturday,
          isArchived: false
        },
        include: {
          items: {
            include: {
              addedBy: {
                select: {
                  id: true,
                  fullName: true,
                  email: true
                }
              }
            }
          }
        }
      });
    }

    res.json(shoppingList);
  } catch (error) {
    console.error('Get current shopping list error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add item to shopping list
router.post('/:familyId/items', async (req, res) => {
  try {
    const { familyId } = req.params;
    const { name, quantity, category, addedById } = req.body;

    // Verify user belongs to this family
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user || user.familyId !== familyId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get current shopping list
    const currentSaturday = getSaturday(new Date());
    let shoppingList = await prisma.shoppingList.findFirst({
      where: {
        familyId,
        weekStart: currentSaturday,
        isArchived: false
      }
    });

    if (!shoppingList) {
      const nextSaturday = new Date(currentSaturday);
      nextSaturday.setDate(nextSaturday.getDate() + 7);

      shoppingList = await prisma.shoppingList.create({
        data: {
          familyId,
          weekStart: currentSaturday,
          weekEnd: nextSaturday,
          isArchived: false
        }
      });
    }

    // Add item
    const item = await prisma.shoppingItem.create({
      data: {
        name,
        quantity: quantity || 1,
        category: category || 'Other',
        addedById: addedById || req.user.userId,
        shoppingListId: shoppingList.id
      },
      include: {
        addedBy: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update item (toggle completion)
router.patch('/items/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { completed } = req.body;

    const item = await prisma.shoppingItem.update({
      where: { id: itemId },
      data: { completed },
      include: {
        addedBy: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    res.json(item);
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete item
router.delete('/items/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;

    await prisma.shoppingItem.delete({
      where: { id: itemId }
    });

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to get Saturday of current week
function getSaturday(date) {
  const day = date.getDay();
  const saturday = new Date(date);
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  saturday.setDate(diff + 5); // Saturday is 5 days after Monday
  saturday.setHours(0, 0, 0, 0);
  return saturday;
}

export default router;