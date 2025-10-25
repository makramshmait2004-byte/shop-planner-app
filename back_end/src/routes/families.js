import express from 'express';
import { prisma } from '../server.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all family routes
router.use(authenticateToken);

// Get family members
router.get('/:familyId/members', async (req, res) => {
  try {
    const { familyId } = req.params;

    // Verify user belongs to this family
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user || user.familyId !== familyId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const members = await prisma.user.findMany({
      where: { familyId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        dateOfBirth: true,
        hobbies: true,
        career: true,
        location: true,
        createdAt: true
      }
    });

    res.json(members);
  } catch (error) {
    console.error('Get family members error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;