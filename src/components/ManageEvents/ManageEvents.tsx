import * as _React from 'react';
import { useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import InfoIcon from '@mui/icons-material/Info';
import { getDatabase, ref, onValue, off, remove, update, set, push } from 'firebase/database';
import { SubmitHandler, useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
    onAuthStateChanged,
    getAuth,
} from 'firebase/auth'
import {
    Box,
    Button,
    Typography,
    Stack,
    Divider,
    // CircularProgress,
    Snackbar,
    Dialog,
    DialogContent,
    Alert
} from '@mui/material'



//internal imports
import { NavBar } from '../sharedComponents/NavBar'
import { InputText, InputPassword } from '../sharedComponents/Inputs'
import a20 from '../../assets/images/ddr_a20_plus.png'
import itg2 from '../../assets/images/itg2.png'
import piu from '../../assets/images/piu_phoenix.jpg'
import expro from '../../assets/images/ddr_extreme.png'
import bg from '../../assets/images/father_and_son.jpg'
import { firebaseConfig } from '../../firebaseConfig'

export interface EventProps {
    name: string
    game: string
    description: string
    date: string
    tournamentOrganizer: string
    //the relation between the TO and the event
    tOID: string
}

const authStyles = {

    main: {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, .3), rgba(0, 0, 0, .5)), url(${bg});`,
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center top 5px',
        position: 'absolute',
        marginTop: '10px'
    },
    stack: {
        width: '350px',
        marginTop: '100px',
        marginRight: 'auto',
        marginLeft: 'auto'
    },
    button: {
        width: '150px',
        fontSize: '14px'
    }
}

//our interfaces for our function arguments

interface Props {
    title: string
}

//making a literal union type for our alerts
type MessageType = 'error' | 'warning' | 'info' | 'success'

const MakeTournament = () => {
    //setting up our hooks
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState<string>('')
    const [messageType, setMessageType] = useState<MessageType>()
    const navigate = useNavigate() // instantiate that useNavigate() object to use
    const auth = getAuth() //essentially monitoring the state of our authorization
    const { register, handleSubmit, control, formState:{errors} } = useForm<EventProps>({})

    const onSubmit: SubmitHandler<EventProps> = async (data, event) => {
        if (event) event.preventDefault();
        console.log(data)
        console.log(localStorage.getItem('organizer'))
        console.log((localStorage.getItem('organizer') === 'true'))
        console.log((auth))
        if ((localStorage.getItem('organizer') === 'true')) { //This can probably be handled by checking when determining a route
            const db = getDatabase()
            const newEvent: EventProps = {
                name: data.name,
                game: data.game,
                description: data.description,
                date: data.date,
                tournamentOrganizer: localStorage.getItem('username') as string,
                tOID: localStorage.getItem('token') as string,
            }
            const eventRef = ref(db, `events/${newEvent.tOID}/`)
            push(eventRef, newEvent)
            // set(eventRef, newEvent)
            .then(() => {
                // Data was successfully added to the database
                console.log(`Successfully created event: ${data.name}`);
                // Once a user is signed in we can display a success message
                setMessage(`Successfully created event: ${data.name}`)
                setMessageType('success')
                setOpen(true)
                setTimeout(() => { navigate('/tournaments') }, 2000)
                })
            .catch((error) => {
                // Handle any errors that occur during the database operation
                console.error('Error adding event data', error);
                const errorMessage = error.message;
                setMessage(errorMessage)
                setMessageType('error')
                setOpen(true)
                });
            } 
            
    }

    return (
        //name: string
        // game: string
        // description: string
        // date: string
        // tournamentOrganizer: string
        // //the relation between the TO and the event
        // tOID: string
        <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Typography variant='h6'>Create Event</Typography>
                <Box>
                    <label htmlFor="name">Event name</label>
                    <Controller
                        name='name'
                        control={control}
                        rules={{ required: 'Event name is required'}}
                        defaultValue=''
                        render={({field}) => <InputText {...field} value={field.value} onChange={field.onChange} name='username' placeholder='Mistake on the Lake 6' />}
                    />
                    {errors.name && <p>{errors.name.message}</p>}

                    <label htmlFor="organizer">What game is this event for?</label>
                    <label>
                        <img src={a20} alt="DDR A20 Plus" />
                        <input
                        type="radio"
                        value="A20"
                        {...register('game', { required: 'Please select an option' })}
                        /> DanceDanceRevolution A20 Plus
                    </label>
                    <label>
                        <img src={expro} alt="DDR Extreme Pro" />
                        <input
                        type="radio"
                        value="Extreme"
                        {...register('game', { required: 'Please select an option' })}
                        /> DanceDanceRevolution Extreme Pro
                    </label>
                    <label>
                        <img src={itg2} alt="In The Groove 2" />
                        <input
                        type="radio"
                        value="ITG"
                        {...register('game', { required: 'Please select an option' })}
                        /> In The Groove 2
                    </label>
                    <label>
                        <img src={piu} alt="Pump It Up" />
                        <input
                        type="radio"
                        value="PIU"
                        {...register('game', { required: 'Please select an option' })}
                        /> Pump It Up
                    </label>

                    <label htmlFor="description">Event Description</label>
                    <Controller
                        name='description'
                        control={control}
                        rules={{ required: 'Description is required'}}
                        defaultValue=''
                        render={({field}) => <InputText {...field} value={field.value} onChange={field.onChange} name='description' placeholder='MEGA' />}
                    />
                    {errors.description && <p>{errors.description.message}</p>}

                    <label htmlFor="date">Event Date</label>
                    <Controller
                        name='date'
                        control={control}
                        rules={{ required: 'Event date is required'}}
                        defaultValue=''
                        render={({field}) => <InputText {...field} value={field.value} onChange={field.onChange} name='date' placeholder='Sampling Masters' />}
                    />
                    {errors.date && <p>{errors.date.message}</p>}

                    
                </Box>
                <Button type='submit'>Register</Button>
            </form>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
            >
                <Alert severity={messageType}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    )

}

export const ManageEvents = (props: Props) => {
    //setup our hooks
    const [open, setOpen] = useState(false)
    // const navigate = useNavigate()
    const [signType, setSignType] = useState('')

    // const handleSnackClose = () => {
    //     setOpen(false)
    //     navigate('shop')
    // }
    return (
        <Box>
            <NavBar />
            <Box sx={authStyles.main}>
                <Stack direction='column' alignItems='center' textAlign='center' sx={authStyles.stack}>
                    <Typography variant='h2' sx={{ color: 'white' }}>
                        {props.title}
                    </Typography>
                    <br />
                    <Typography variant='h5'>WE NEED MORE TOURNAMENTS</Typography>
                    <br />
                    {/* <GoogleButton open={open} onClick={handleSnackClose} /> */}
                    <Divider variant='fullWidth' color='width' />
                    <Stack
                        alignItems='center'
                        justifyContent='space-between'
                        direction='row'
                    >
                        <Button
                            variant='contained'
                            color='primary'
                            size='large'
                            sx={authStyles.button}
                            onClick={() => { setOpen(true); setSignType('signin') }}
                        >
                            Create Event
                        </Button>
                    </Stack>
                </Stack>
                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogContent>
                        <MakeTournament/>
                    </DialogContent>
                </Dialog>
            </Box>
        </Box>
    )
}