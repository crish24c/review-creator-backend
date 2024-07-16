import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let reviews

 export default class ReviewsDAO {
   static async injectDB(conn) {
     if (reviews) {
       return
     }
     try {
       reviews = await conn.db("reviews-cluster").collection("reviews")
     } catch (e) {
       console.error(`Unable to establish collection handles in userDAO: ${e}`)
     }
   }

   static async addReview(movieId, user, review)  {
     try {
       const reviewDoc = {
         movieId: movieId,
         user: user,
         review: review,
       }
       console.log("adding")
       console.log(reviewDoc)
       await reviews.insertOne(reviewDoc)
       return reviewDoc
     } catch (e) {
       console.error(`Unable to post review: ${e}`)
       return { error: e }
     }  
   }

   static async getReview(reviewId) {
     try {
       const reviewDoc = await reviews.findOne({
         _id: ObjectId(reviewId),
       })
       return reviewDoc
     } catch (e) {
       console.error(`Unable to get review: ${e}`)
       return { error: e }
     }
   }

   static async updateReview(reviewId, user, review) {
     try {
       const updateResponse = await reviews.updateOne(
         {
           _id: ObjectId(reviewId),
         },
         {
           $set: {
             user: user,
             review: review,
           },
         }
       )

       return updateResponse
     } catch (e) {
       console.error(`Unable to update review: ${e}`)
       return { error: e }
     }
   }

   static async getReviewsByMovieId(movieId) {
     try {
       const cursor = await reviews.find({ movieId: parseInt(movieId) })
       return cursor.toArray()
     } catch (e) {
       console.error(`Unable to get review: ${e}`)
       return { error: e }
     }
   }
 }