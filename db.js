const firebase = require('firebase');
const uniqid = require('uniqid')

const firebaseConfig = {
    apiKey: "AIzaSyCFDHTQgMZnbG2fB5SKN-ggcYzfK3PlWYY",
    authDomain: "bot-divulga.firebaseapp.com",
    projectId: "bot-divulga",
    storageBucket: "bot-divulga.appspot.com",
    messagingSenderId: "493520807480",
    appId: "1:493520807480:web:66b344f47d923d178528cd"
};

firebase.default.initializeApp(firebaseConfig);
const FB = firebase.default.firestore();

//#region Channels
const GetChannels = async () => {
    const channels = (await FB.collection('channels').doc("channels").get()).data().channels

    return channels
}

const AddChannel = async (channelId) => {
    try {
        await FB.collection("channels").doc("channels").update({
            "channels": firebase.default.firestore.FieldValue.arrayUnion(channelId)
        })
        return { error: false }
    } catch {
        return { error: true }
    }
}

const RemoveChannel = async (channelId) => {
    try {
        await FB.collection("channels").doc("channels").update({
            "channels": firebase.default.firestore.FieldValue.arrayRemove(channelId)
        })
        return { error: false }
    } catch {
        return { error: true }
    }
}

//#endregion






//#region Messages 

const msgCollection = FB.collection("messages").doc("messages")

const NewMessage = async (message) => {
    try {
        const id = uniqid()

        await msgCollection.update({
            "messages": firebase.default.firestore.FieldValue.arrayUnion({
                msg: message,
                time: 3 * 60 * 1000,
                id: id,
                active: false
            })
        })
        return { error: false, id }
    } catch {
        return { error: true }
    }

}

const RmMessage = async (id) => {
    const msg = (await msgCollection.get()).data().messages.filter(i => i.id == id)

    try {
        await msgCollection.update({
            "messages": firebase.default.firestore.FieldValue.arrayRemove(msg[0])
        })
        return { error: false }
    } catch {
        return { error: true }
    }
}

const GetMessages = async () => {
    const msgs = (await msgCollection.get()).data().messages

    return msgs
}

const GetMessage = async (id) => {
    const msg = (await msgCollection.get()).data().messages.filter(i => i.id == id)

    return msg[0]
}

const SetImgMsg = async (id, img) => {
    const infos = await GetMessage(id)

    try {
        await RmMessage(id)
        await msgCollection.update({
            "messages": firebase.default.firestore.FieldValue.arrayUnion({
                ...infos,
                img: img
            })
        })
        return { error: false }
    } catch(err) {
        console.log(err);
        return { error: true }
    }
}

const SetMsgOn = async (id)=> {
    const infos = await GetMessage(id)

    try {
        await RmMessage(id)
        await msgCollection.update({
            "messages": firebase.default.firestore.FieldValue.arrayUnion({
                ...infos,
                active: true
            })
        })
        return { error: false }
    } catch(err) {
        console.log(err);
        return { error: true }
    }
}

const SetMsgOff = async (id)=> {
    const infos = await GetMessage(id)

    try {
        await RmMessage(id)
        await msgCollection.update({
            "messages": firebase.default.firestore.FieldValue.arrayUnion({
                ...infos,
                active: false
            })
        })
        return { error: false }
    } catch(err) {
        console.log(err);
        return { error: true }
    }
}

//#endregion


module.exports = {
    GetChannels,
    AddChannel,
    RemoveChannel,
    NewMessage,
    RmMessage,
    GetMessages,
    GetMessage,
    SetImgMsg,
    SetMsgOn,
    SetMsgOff
}