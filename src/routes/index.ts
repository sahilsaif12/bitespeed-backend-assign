import contactRoutes from './contact.route';
function setRoutes(app) {
    
    app.get('/', (req, res) => {
            res.send('Welcome to the Express backend application for BITESPEED assignment!');
        }
    );

    // Set up the contact routes
    // This will handle requests to /identify
    app.use('/identify', contactRoutes);
}

export default setRoutes;
