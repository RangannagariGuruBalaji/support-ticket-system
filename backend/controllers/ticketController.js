const ticketService = require('../services/ticketService');

const createTicket = async (req, res, next) => {
    try {
        const { subject, description, priority } = req.body;
        const ticket = await ticketService.createTicket({
            user_id: req.user.id,
            subject,
            description,
            priority
        });
        res.status(201).json({
            success: true,
            message: 'Support ticket created successfully',
            data: ticket
        });
    } catch (err) {
        next(err);
    }
};

const getTickets = async (req, res, next) => {
    try {
        const { status, priority, search, sort, openWithCustomer } = req.query;
        const tickets = await ticketService.getTickets({
            user: req.user,
            status,
            priority,
            search,
            sort,
            openWithCustomer
        });
        res.status(200).json({
            success: true,
            count: tickets.length,
            data: tickets
        });
    } catch (err) {
        next(err);
    }
};

const getTicketById = async (req, res, next) => {
    try {
        const ticketId = parseInt(req.params.id, 10);
        if (isNaN(ticketId)) {
            return res.status(400).json({ success: false, error: 'Invalid ticket ID format' });
        }
        const ticket = await ticketService.getTicketById(ticketId, req.user);
        res.status(200).json({ success: true, data: ticket });
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json({ success: false, error: err.message });
        }
        next(err);
    }
};

const updateTicket = async (req, res, next) => {
    try {
        const ticketId = parseInt(req.params.id, 10);
        if (isNaN(ticketId)) {
            return res.status(400).json({ success: false, error: 'Invalid ticket ID format' });
        }
        const updated = await ticketService.updateTicket(ticketId, req.body, req.user);
        res.status(200).json({
            success: true,
            message: 'Ticket updated successfully',
            data: updated
        });
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json({ success: false, error: err.message });
        }
        next(err);
    }
};

const deleteTicket = async (req, res, next) => {
    try {
        const ticketId = parseInt(req.params.id, 10);
        if (isNaN(ticketId)) {
            return res.status(400).json({ success: false, error: 'Invalid ticket ID format' });
        }
        await ticketService.deleteTicket(ticketId, req.user);
        res.status(200).json({
            success: true,
            message: 'Ticket deleted successfully'
        });
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json({ success: false, error: err.message });
        }
        next(err);
    }
};

const getTicketStats = async (req, res, next) => {
    try {
        const stats = await ticketService.getTicketStats();
        res.status(200).json({ success: true, data: stats });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createTicket,
    getTickets,
    getTicketById,
    updateTicket,
    deleteTicket,
    getTicketStats
};
