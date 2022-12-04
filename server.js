require("dotenv").config();

const { createApp } = require("./app");

const startServer = async () => {
    const app = createApp();
    const PORT = process.env.PORT;
    
    app.listen(PORT, () => {
        console.log(`Express Server listening on Port ${PORT}`);
    });
};

startServer();