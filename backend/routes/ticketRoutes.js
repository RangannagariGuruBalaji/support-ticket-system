const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { validateTicketCreation } = require('../middleware/validationMiddleware');

router.use(authenticate);

router.get('/stats', requireRole('agent'), ticketController.getTicketStats);
router.get('/', ticketController.getTickets);
router.post('/', validateTicketCreation, ticketController.createTicket);
router.get('/:id', ticketController.getTicketById);
router.put('/:id', requireRole('agent'), ticketController.updateTicket);
router.delete('/:id', ticketController.deleteTicket);

router.get('/:id/comments', commentController.getComments);
router.post('/:id/comments', commentController.addComment);

module.exports = router;
