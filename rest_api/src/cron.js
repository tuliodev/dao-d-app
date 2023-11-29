const cron = require('node-cron');

console.log('running the cron')

cron.schedule('* * * * *', () => {
    console.log('running task')
})
