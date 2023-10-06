import _React, { useEffect, useState } from 'react'
import axios from 'axios'

interface TimeZoneProps {
    timezone: string
}

export const Clock: React.FC<TimeZoneProps> = ({timezone}) => {
    const [currentTime, setCurentTime] = useState<string>('')

    const fetchCurrentTime = () => {
        const url = `http://worldtimeapi.org/api/timezone/${timezone}`
    

    axios.get(url)
    .then((response) => {
        const { datetime } = response.data
        setCurentTime(datetime)
    })
    .catch((error) => {
        console.error('Error getting the time: ', error)
    })
}

useEffect(() => {
    fetchCurrentTime()

    const interval = setInterval(fetchCurrentTime, 30000)
    return () => clearInterval(interval)
}, [timezone])

return (
    <div style={{paddingLeft:'16rem'}}>
        <h6>Current Time ({timezone}):</h6>
        <p>{currentTime}</p>
    </div>
    )
}