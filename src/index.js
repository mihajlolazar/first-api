const createApp = require('./create-app');


const port = process.env.PORT || 1337;


createApp().then(app => { 
    app.listen(port,console.log('Listening on: ', port))})
    .catch(e => (console.log(e)))

