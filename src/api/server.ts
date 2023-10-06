// Twilio phone number: 18444743165
// Account SID: ACd8237ff05b7b0a212d13278913fa49db
// Auth Token: 2b8f98b7ef8de8f1a12a217040156255

// import { Twilio } from 'twilio';

// export const sendText = () => {
//     const accountSID = 'ACd8237ff05b7b0a212d13278913fa49db'
//     const authToken = '2b8f98b7ef8de8f1a12a217040156255'
    
//     //Instantiating the Twilio client
//     const client = twilio(accountSID, authToken)
    
//     const twilioPhoneNumber = '18444743165'
//     const receivingNumber = '18474451621'
//     const message = 'How could you do this to me?'
    
//     //Sending the message
//     client.messages
//         .create({
//             body: message,
//             from: twilioPhoneNumber,
//             to: receivingNumber
//         })
//         .then((message) => console.log(`Message sent with SID ${message.sid}`))
//         .catch((error) => console.log(`Error sending message: ${error.message}`))
// }

// Firebase Realtime Database
// databaseURL: "https://totools-default-rtdb.firebaseio.com/",
// apiKey: "AIzaSyB9y2i1jk0EXPmnDql1OZp1aTDSX7a3gRg",
import { EventProps } from "../components"
import { getDatabase, ref, get, push, update, remove } from "firebase/database"
// import { CustomVonage } from "@vonage/server-sdk"
// const vonage = new CustomVonage({
//     apiKey: '3138c418',
//     apiSecret: "NcHFDecDY86Pq8M9"
// })

type PartialEvent = Partial<EventProps>

// const from = '14423397725'
// const to = '18474451621'
// const text = 'How could you do this to me?'


export const serverCalls = {

    getUsers: async () => {

        //getting the Firebase RT database and a reference to the "Users" data
        const db = getDatabase()
        const usersRef = ref(db, 'users')
        let data
        //Fetching the data
        await get(usersRef)
        .then((snapshot) => {
            if(snapshot.exists()) {
                data = snapshot.val()
                console.log('Here is the "users" data', data)
            } else {
                console.log('There are no users currently.')
            }
        })
        .catch((error) => {
            console.log('Error grabbing user data:', error)
        })
        return data
    },

    getEvents: async () => {

        // //getting the Firebase RT database and a reference to the "Users" data
        // const db = getDatabase()
        // const usersRef = ref(db, 'events')
        // let data
        // //Fetching the data
        // await get(usersRef)
        // .then((snapshot) => {
        //     if(snapshot.exists()) {
        //         data = snapshot.val()
        //         console.log('Here is the Events data', data)
        //     } else {
        //         console.log('There are no Events currently.')
        //     }
        // })
        // .catch((error) => {
        //     console.log('Error grabbing Events data:', error)
        // })
        // return data

        try {
            // Getting the Firebase RT database and a reference to the "Events" data
            const db = getDatabase();
            const eventsRef = ref(db, 'events');
    
            // Fetching the data
            const snapshot = await get(eventsRef);
    
            if (snapshot.exists()) {
                const data = snapshot.val();
                let eventIDs = []
                let events:EventProps[] = []
                // console.log('Here is the Events data', data);
                for (const key in data){
                    // console.log(key)
                    console.log(data[key])
                    for (const key2 in data[key]){
                        // console.log(typeof key2)
                        // console.log(key2)
                        console.log(data[key][key2])
                        events.push(data[key][key2])
                        eventIDs.push([key,key2])
                    }
                }
                console.log(eventIDs)
                return [events,eventIDs];
            } else {
                console.log('There are no Events currently.');
                return []; 
            }
        } catch (error) {
            console.error('Error grabbing Events data:', error);
            throw error; // You can choose to handle or rethrow the error as needed.
        }
    },

    updateEvent: async (eventID: string, toID: string, data: PartialEvent) => {
        const db = getDatabase()
        const user = toID
        const event = eventID
        const eventRef = ref(db, `events/${user}/${event}`)
        const newData = {
            name: data.name,
            description: data.description,
            game: data.game,
            date: data.date,
            tournamentOrganizer: data.tournamentOrganizer,
            tOID: data.tOID,
        }
        update(eventRef, newData)
        .then(() => {
            console.log('Data updated successfully')
        })
        .catch((error) => {
            console.log('Error updating data: ', error)
        })
    },

    deleteEvent: async (eventID: string, toID: string) => {
        const db = getDatabase()
        const eventRef = ref(db, `events/${toID}/${eventID}`)

        remove(eventRef)
            .then(() => {
                console.log("Event deleted successfully.")
            })
            .catch((error) => {
                console.log("Error deleting event: ", error)
            })
    }

    // sendText: async () => {
    //         // const accountSID = 'ACd8237ff05b7b0a212d13278913fa49db'
    //         // const authToken = '2b8f98b7ef8de8f1a12a217040156255'
    //         // const twilioPhoneNumber = '18444743165'
    //         // const client = new Twilio(accountSID, authToken);
    //     try {
    //         const response  = await vonage.sms.send({to, from, text})
    //         console.log('Message sent successfully')
    //         console.log(response)
    //     } catch (error) {
    //         console.log('There was an error sending the message.')
    //         console.log(error)
    //     }
            
    //         //Sending the message
    //         // client.messages
    //         //     .create({
    //         //         body: message,
    //         //         from: twilioPhoneNumber,
    //         //         to: receivingNumber
    //         //     })
    //         //     .then((message) => console.log(`Message sent with SID ${message.sid}`))
    //         //     .catch((error) => console.log(`Error sending message: ${error.message}`))
            
            
            
    //     }
}