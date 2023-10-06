import * as _React from 'react'
import { useState, useEffect } from 'react'

//internal imports
import { serverCalls } from '../api'
import { EventProps } from '../components'

interface UseGetEventData {
    eventData: EventProps[]
    eventIDs: string[]
    getData: () => void
}

export const useGetEvent = (): UseGetEventData => {
    const [eventData, setEventData] = useState<EventProps[]>([])
    const [eventIDs, setEventIDs] = useState<string[]>([])

    async function handleDataFetch() {
        try{
            const [events, eventIDs] = await serverCalls.getEvents()
            setEventData(events)
            setEventIDs(eventIDs)
        } catch (error){
            console.log('Error fetching events: ', error)
        }
        
    }

    useEffect(() => {
        handleDataFetch()
    }, [])

    return { eventData, eventIDs, getData: handleDataFetch}
}