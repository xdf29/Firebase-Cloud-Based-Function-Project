const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp()

//Auth Trigger (new user signup)
exports.newUserSignUp = functions.auth.user().onCreate(user => {
    return admin.firestore().collection('users').doc(user.uid).set({
        email: user.email,
        upvotedOn: []
    })
})

//Auth Trigger (user deleted)
exports.userDeleted = functions.auth.user().onDelete(user => {
    const doc = admin.firestore().collection('users').doc(user.uid)
    return doc.delete()
})

//Add Request
exports.addRequest = functions.https.onCall((data, context)=>{
    if(!context.auth){
        throw new functions.https.HttpsError(
            'unauthenticated',
            'Only Authenticated User Can Submit a Request'
        )
    }
    if(data.text.length > 30){
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Request Title Must Not Be More Than 30 Characters'
        )
    }
    return admin.firestore().collection('requests').add({
        text: data.text,
        upvotes: 0
    })
})

//Upvote Callable Function
exports.upvote = functions.https.onCall(async (data,context)=>{
    if(!context.auth){
        throw new functions.https.HttpsError(
            'unauthenticated',
            'Onlu Authenticated User Can Upvote A Request'
        )
    }
    //get refs for user doc and request doc
    const user = admin.firestore().collection('users').doc(context.auth.uid)
    const request = admin.firestore().collection('requests').doc(data.id)
    
    const doc = await user.get()
    if(doc.data().upvotedOn.includes(data.id)){
        throw new functions.https.HttpsError(
            'failed-precondition',
            'You Can Only Upvote a Request Once'
        )
    }

    await user.update({
        upvotedOn: [...doc.data().upvotedOn, data.id]
    })
    
    return request.update({
        upvotes: admin.firestore.FieldValue.increment(1)
    })
})

//firestore trigger
exports.logActivities = functions.firestore.document('/{collection}/{id}')
    .onCreate((snap, context) => {
        const collection = context.params.collection
        const id = context.params.id
        console.log(snap.data())

        const activities = admin.firestore().collection('activities')

        if(collection === 'requests'){
            return activities.add({
                text: 'A New Request Was Added'
            })
        }

        if(collection === 'users'){
            return activities.add({
                text: 'A New User Signed Up'
            })
        }

        return null
    })
/*//http request 1
exports.randomNumber = functions.https.onRequest((request, response)=>{

    const number = Math.round(Math.random() * 100)
    response.send(number.toString())

})

//http callable fn
exports.sayHello = functions.https.onCall((data, context)=>{
    return `Hello ${data.name}`
})*/
