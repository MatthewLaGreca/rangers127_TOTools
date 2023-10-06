import * as _React from 'react';
import { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    Stack,
    Typography,
    Snackbar,
    Alert
} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import InfoIcon from '@mui/icons-material/Info';
import { SubmitHandler, useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
    getAuth,
} from 'firebase/auth'



// internal imports
import { NavBar } from '../sharedComponents/NavBar';
import { theme } from '../../Theme/themes';
import { InputText } from '../sharedComponents/Inputs';
import { MessageType } from '../Auth';
import { EventProps } from '..';
import { serverCalls } from '../../api';
import A20 from '../../assets/images/ddr_a20_plus.png'
import ITG from '../../assets/images/itg2.png'
import PIU from '../../assets/images/piu_phoenix.jpg'
import Extreme from '../../assets/images/ddr_extreme.png'
import ULT from '../../assets/images/smash.jpg'
import { useGetEvent } from '../../customHooks';

const images: { [key: string]: string } = {
    A20,
    ITG,
    PIU,
    Extreme,
    ULT,
  };

export const tournamentStyles = {
    main: {
        backgroundColor: theme.palette.secondary.main,
        height: '100%',
        width: '100%',
        color: 'white',
        backgroundSize: 'cover',
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: 'fixed',
        position: 'absolute',
        overflow: 'auto',
        paddingBottom: '100px'
    },
    grid: {
        marginTop: '25px',
        marginRight: 'auto',
        marginLeft: 'auto',
        width: '70vw'
    },
    card: {
        width: "300px",
        padding: '10px',
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.secondary.light,
        border: '1px solid',
        borderColor: theme.palette.primary.main,
        borderRadius: '10px'
    },
    cardMedia: {
        width: '95%',
        margin: 'auto',
        marginTop: '5px',
        aspectRatio: '2/1',
        border: '1px solid',
        borderColor: theme.palette.primary.main,
        borderRadius: '10px'
    },
    button: {
        color: 'white',
        borderRadius: '50px',
        height: '45px',
        width: '250px',
        marginTop: '10px'
    },
    stack: {
        width: '75%',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    stack2: {
        border: '1px solid',
        borderColor: theme.palette.primary.main,
        borderRadius: '50px',
        width: '100%',
        marginTop: '10px',
        marginLeft: '10px'
    },
    typography: {
        marginLeft: '15vw',
        color: "white",
        marginTop: '100px'
    }

}

// interface SingleEvent {
//     theEvent: EventProps
// }


const UpdateTournament = ({ index }: { index: number }) => {
    //setting up our hooks
    const [open, setOpen] = useState(false)
    const [message] = useState<string>('')
    const [messageType, setMessageType] = useState<MessageType>()
    const navigate = useNavigate() // instantiate that useNavigate() object to use
    const auth = getAuth() //essentially monitoring the state of our authorization
    const { register, handleSubmit, control, formState: { errors } } = useForm<EventProps>({})

    const { eventData, eventIDs } = useGetEvent()

    const onSubmit: SubmitHandler<EventProps> = async (data, event) => {
        if (event) event.preventDefault();
        console.log(data)
        console.log(localStorage.getItem('organizer'))
        console.log((localStorage.getItem('organizer') === 'true'))
        console.log((auth))
        // const db = getDatabase()
        // const user = toID
        // const event = eventID
        // const eventRef = ref(db, `events/${user}/${event}`)
        // const newData = {
        //     name: data.name,
        //     description: data.description,
        //     game: data.game,
        //     date: data.date,
        //     tournamentOrganizer: data.tournamentOrganizer,
        //     tOID: data.tOID,
        // }
        if ((localStorage.getItem('organizer') === 'true')) { //This can probably be handled by checking when determining a route
            const newEvent: EventProps = {
                name: data.name,
                game: data.game,
                description: data.description,
                date: data.date,
                tournamentOrganizer: eventData[index]['tournamentOrganizer'],
                tOID: eventIDs[index][0],
            }
            await serverCalls.updateEvent(eventIDs[index][1], eventIDs[index][0], newEvent)
                .then(() => {
                    setMessageType('success')
                    setOpen(true)
                    setTimeout(() => { navigate('/tournaments') }, 2000)
                })
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
                <Typography variant='h6'>Update Event</Typography>
                <Box>
                    <label htmlFor="name">Event name</label>
                    <Controller
                        name='name'
                        control={control}
                        rules={{ required: 'Event name is required' }}
                        defaultValue=''
                        render={({ field }) => <InputText {...field} value={field.value} onChange={field.onChange} name='username' placeholder='Mistake on the Lake 6' />}
                    />
                    {errors.name && <p>{errors.name.message}</p>}

                    <label htmlFor="organizer">What game is this event for?</label>
                    <label>
                        <img src={A20} alt="DDR A20 Plus" />
                        <input
                            type="radio"
                            value="A20"
                            {...register('game', { required: 'Please select an option' })}
                        /> DanceDanceRevolution A20 Plus
                    </label>
                    <label>
                        <img src={Extreme} alt="DDR Extreme Pro" />
                        <input
                            type="radio"
                            value="Extreme"
                            {...register('game', { required: 'Please select an option' })}
                        /> DanceDanceRevolution Extreme Pro
                    </label>
                    <label>
                        <img src={ITG} alt="In The Groove 2" />
                        <input
                            type="radio"
                            value="ITG"
                            {...register('game', { required: 'Please select an option' })}
                        /> In The Groove 2
                    </label>
                    <label>
                        <img src={PIU} alt="Pump It Up" />
                        <input
                            type="radio"
                            value="PIU"
                            {...register('game', { required: 'Please select an option' })}
                        /> Pump It Up
                    </label>
                    <label>
                        <img src={ULT} alt="Smash Ultimate" />
                        <input
                            type="radio"
                            value="ULT"
                            {...register('game', { required: 'Please select an option' })}
                        /> Super Smash Bros. Ultimate
                    </label>

                    <label htmlFor="description">Event Description</label>
                    <Controller
                        name='description'
                        control={control}
                        rules={{ required: 'Description is required' }}
                        defaultValue=''
                        render={({ field }) => <InputText {...field} value={field.value} onChange={field.onChange} name='description' placeholder='MEGA' />}
                    />
                    {errors.description && <p>{errors.description.message}</p>}

                    <label htmlFor="date">Event Date</label>
                    <Controller
                        name='date'
                        control={control}
                        rules={{ required: 'Event date is required' }}
                        defaultValue=''
                        render={({ field }) => <InputText {...field} value={field.value} onChange={field.onChange} name='date' placeholder='Sampling Masters' />}
                    />
                    {errors.date && <p>{errors.date.message}</p>}


                </Box>
                <Button type='submit'>Update</Button>
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

const DeleteTournament = ({ index }: { index: number }) => {
    //setting up our hooks
    const [open, setOpen] = useState(false)
    const [message] = useState<string>('')
    const [messageType, setMessageType] = useState<MessageType>()
    const navigate = useNavigate() // instantiate that useNavigate() object to use
    const auth = getAuth() //essentially monitoring the state of our authorization
    const { handleSubmit } = useForm<EventProps>({})

    const { eventIDs } = useGetEvent()

    const onSubmit: SubmitHandler<EventProps> = async (data, event) => {
        if (event) event.preventDefault();
        console.log(data)
        console.log(localStorage.getItem('organizer'))
        console.log((localStorage.getItem('organizer') === 'true'))
        console.log((auth))
        // const db = getDatabase()
        // const user = toID
        // const event = eventID
        // const eventRef = ref(db, `events/${user}/${event}`)
        // const newData = {
        //     name: data.name,
        //     description: data.description,
        //     game: data.game,
        //     date: data.date,
        //     tournamentOrganizer: data.tournamentOrganizer,
        //     tOID: data.tOID,
        // }
        if ((localStorage.getItem('organizer') === 'true')) { //This can probably be handled by checking when determining a route
            await serverCalls.deleteEvent(eventIDs[index][1], eventIDs[index][0])
                .then(() => {
                    setMessageType('success')
                    setOpen(true)
                    setTimeout(() => { navigate('/tournaments') }, 2000)
                })
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
                <Typography variant='h6'>Update Event</Typography>
                <Box>
                    <Typography>
                        Are you sure you want to delete this tournament?
                    </Typography>
                </Box>
                <Button type='submit'>Delete</Button>
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

export const Events = () => {
    const { eventData } = useGetEvent();
    const [open, setOpen] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
    // const [currentEvents, setCurrentEvents] = useState<EventProps>();
    // const [cartOpen, setCartOpen] = useState(false);
    const handleUpdateForm = (index: number) => {
        setSelectedIndex(index)
        setDeleteIndex(null)
    }

    const handleDeleteForm = (index: number) => {
        setSelectedIndex(null)
        setDeleteIndex(index)
    }

    if (!eventData) {
        // Handle the case when eventData is undefined (e.g., while data is being fetched)
        return (
            <Box sx={tournamentStyles.main}>
                <NavBar />
                <Typography
                    variant='h4'
                    sx={tournamentStyles.typography}
                >
                    Loading...
                </Typography>
            </Box>
        );
    }

    if (eventData.length === 0) {
        // Handle the case when eventData is an empty array
        return (
            <Box sx={tournamentStyles.main}>
                <NavBar />
                <Typography
                    variant='h4'
                    sx={tournamentStyles.typography}
                >
                    No events available.
                </Typography>
            </Box>
        );
    }

    console.log(eventData)
    return (
        <Box sx={tournamentStyles.main} >
            <NavBar />
            <Typography
                variant='h4'
                sx={tournamentStyles.typography}
            >
                Tournaments that you can enter!
            </Typography>
            <Grid container spacing={3} sx={tournamentStyles.grid}>
                {eventData.map((events: EventProps, index: number) => (
                    <Grid item key={index} xs={12} sm={6} md={4}>
                        <Card sx={tournamentStyles.card}>
                            <CardMedia
                                component='img'
                                sx={tournamentStyles.cardMedia}
                                image={images[events.game]}
                                alt={events.game}
                            />
                            <CardContent>
                                <Stack direction='column' justifyContent='space-between' alignItems='center'>
                                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                        <Accordion sx={{ color: 'white', backgroundColor: theme.palette.secondary.light }}>
                                            <AccordionSummary
                                                expandIcon={<InfoIcon sx={{ color: theme.palette.primary.main }} />}
                                                aria-controls='panel1a-content'
                                                id='panel1-header'
                                            >
                                                <Typography>{events.name}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>
                                                    Game: {events.game}
                                                    <br />
                                                    Description: {events.description}
                                                    <br />
                                                    Date: {events.date}
                                                    <br />
                                                    Organizer: {events.tournamentOrganizer}
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Stack>
                                    <Button
                                        size='medium'
                                        variant='outlined'
                                        onClick={() => { setOpen(true); handleUpdateForm(index) }} // Pass the index when the button is clicked
                                        sx={tournamentStyles.button}
                                    >
                                        Update Event
                                    </Button>
                                    <Button
                                        size='medium'
                                        variant='outlined'
                                        onClick={() => { setOpen(true); handleDeleteForm(index) }} // Pass the index when the button is clicked
                                        sx={tournamentStyles.button}
                                    >
                                        Delete Event
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent>
                    {selectedIndex !== null && (<UpdateTournament index={selectedIndex} />)}
                    {deleteIndex !== null && (<DeleteTournament index={deleteIndex} />)}
                </DialogContent>
            </Dialog>
            {/* <Dialog open={cartOpen} onClose={() => { setCartOpen(false) }}>
                <DialogContent>
                    <DialogContentText>Add to Cart</DialogContentText>
                    <AddToCart cartItem={currentShop as ShopState} />
                </DialogContent>
            </Dialog> */}
        </Box>
    )
}