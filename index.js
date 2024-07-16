import app from "./server.js"
import mongodb from "mongodb"
import ReviewsDAO from "./dao/reviewsDAO.js"

const mongoClient = mongodb.MongoClient
const mongo_username = process.env['MONGO_DB_USERNAME']
const mongo_pw = process.env['MONGO_DB_PW']
const uri = `mongodb+srv://${mongo_username}:${mongo_pw}@reviews-cluster.t7cfplm.mongodb.net/?retryWrites=true&w=majority&appName=reviews-cluster`

const port = 8000

mongoClient.connect(
  uri,
  {
    maxPoolSize: 50,
    wtimeoutMS: 2500,
    useNewUrlParser: true
  })
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
  .then(async client => {
    await ReviewsDAO.injectDB(client)
    app.listen(port, () => {
      console.log(`listening on port ${port}`)
    })
  })