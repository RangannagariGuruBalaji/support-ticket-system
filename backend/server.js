const app = require('./app');

if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Support Ticket Management System API running on port ${PORT}`);
    });
}

module.exports = app;
