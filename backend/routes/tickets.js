const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const commentController = require('../controllers/commentController');
const { authenticate, requireRole } = require('../middleware/auth');

// All ticket routes require authentication
router.use(authenticate);

// Ticket Statistics (Agent Only)
router.get('/stats', requireRole('agent'), ticketController.getTicketStats);

// Ticket CRUD operations
router.get('/', ticketController.getTickets);
router.post('/', ticketController.createTicket);
router.get('/:id', ticketController.getTicketById);
router.put('/:id', requireRole('agent'), ticketController.updateTicket);
router.delete('/:id', ticketController.deleteTicket);

// Ticket Comment operations
router.get('/:id/comments', commentController.getComments);
router.post('/:id/comments', commentController.addComment);

module.exports = router;
