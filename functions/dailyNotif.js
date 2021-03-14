const axios = require('axios').default;
axios.defaults.headers.common['Postbacks-Authorization'] = process.env.POSTBACKSAPIKEY;

const { codechefHandler, codeforcesHandler, hackerearthHandler } = require("./events");

const { db, callSendAPI } = require('./messenger')


async function sendNotifications(req, res) {
    try {
        let userCollection = await db.collection('users').get()
        let platforms = ['codeforces', 'codechef', 'hackerearth']
        let subscribers = {
            codechef: [], codeforces: [], hackerearth: [], all: []
        }
        userCollection.forEach(user => {
            if (user.data().codeforces === true) subscribers.codeforces.push(user.id)
            if (user.data().codechef === true) subscribers.codechef.push(user.id)
            if (user.data().hackerearth === true) subscribers.hackerearth.push(user.id)
            subscribers.all.push(user.id)
        })

        let events = {}
        events.codechef = await codechefHandler()
        events.codeforces = await codeforcesHandler()
        events.hackerearth = await hackerearthHandler()
        // res.json(events)
        await platforms.forEach(async (platform) => {
            // console.log(events + '  ppp')
            let message = ''
            if (events[platform][0].Error) message = `No new events on ${platform} today :(`
            else {
                message += `⚡${platform.toUpperCase()} events today:\n\n`;
                events[platform].forEach(event => {
                    message += `🎮 ${event.Name}\n⏰ ${event.EndTime}\n🔗 ${event.url}\n\n`
                })
            }

            subscribers[platform].forEach(async (psid) => {
                await callSendAPI(psid, { text: message })
            })
        })

        await subscribers.all.forEach(async (psid) => {
            let message = 'Please send a 👍🏻 so that we can send you notifications tomorrow too! (Limitations from Facebook :( )'
            await callSendAPI(psid, { text: message })
        })
        await scheduleNextNotification()
        res.json({ status: 'success' })

    } catch (err) { console.log(err); res.json({ error: err }) }
}


async function scheduleNextNotification() {
    let timestamp = new Date().getTime()
    timestamp = Math.floor(timestamp/1000) + (24 * 60 * 60)
    // timestamp = Math.floor(timestamp/1000) + (90)
    console.log('Next notification scheduled at: ' + timestamp)
    try {
      let postbacksRes = await axios.post(
        'https://api.postbacks.io/v1/requestPostback',   
        {
          "url": process.env.PUBLICENDPOINT,
          "send_at": timestamp,
          "body_string": "{  }"
        }
      )
        // console.log(postbacksRes)
    } catch(err) {console.log(err)}
  }
  
module.exports = { sendNotifications }