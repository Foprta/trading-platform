const app = require('./app');
const config = require('./configs/server');
require('./app/socket/routes/routes')

const server = app.listen(config.PORT, () => {
    console.info(`Server started on port ${config.PORT}`);
});
