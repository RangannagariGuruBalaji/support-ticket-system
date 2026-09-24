const commentService = require('../services/commentService');

const getComments = async (req, res, next) => {
    try {
        const ticketId = parseInt(req.params.id, 10);
        if (isNaN(ticketId)) {
            return res.status(400).json({ success: false, error: 'Invalid ticket ID' });
        }
        const comments = await commentService.getCommentsByTicketId(ticketId, req.user);
        res.status(200).json({ success: true, data: comments });
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json({ success: false, error: err.message });
        }
        next(err);
    }
};

const addComment = async (req, res, next) => {
    try {
        const ticketId = parseInt(req.params.id, 10);
        if (isNaN(ticketId)) {
            return res.status(400).json({ success: false, error: 'Invalid ticket ID' });
        }
        const { comment } = req.body;
        if (!comment || !comment.trim()) {
            return res.status(400).json({ success: false, error: 'Comment body cannot be empty' });
        }
        const newComment = await commentService.addCommentToTicket(ticketId, comment, req.user);
        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            data: newComment
        });
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json({ success: false, error: err.message });
        }
        next(err);
    }
};

module.exports = {
    getComments,
    addComment
};
