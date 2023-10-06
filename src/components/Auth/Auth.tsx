import * as _React from 'react'
import { useState } from 'react'
// import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
import {
    onAuthStateChanged,
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth'
import { SubmitHandler, useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
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
import { getDatabase, ref, set } from 'firebase/database'


//internal imports
import { NavBar } from '../sharedComponents/NavBar'
import { InputText, InputPassword } from '../sharedComponents/Inputs'
import bg from '../../assets/images/img.png'
import { firebaseConfig } from '../../firebaseConfig'


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

// interface ButtonProps {
//     open: boolean
//     onClick: () => void
// }

interface SubmitProps {
    email: string
    password: string
    phone: string
    username: string
    firstName: string
    lastName: string
    organizer: boolean
}

//making a literal union type for our alerts
export type MessageType = 'error' | 'warning' | 'info' | 'success'


// const GoogleButton = (_props: ButtonProps) => {
//     //setting up our hooks to manage the state of some things
//     const [open, setOpen] = useState(false)
//     const [message, setMessage] = useState<string>('')
//     const [messageType, setMessageType] = useState<MessageType>()
//     const navigate = useNavigate() // instantiate that useNavigate() object to use
//     const auth = getAuth() //essentially monitoring the state of our authorization
//     // const [signInWithGoogle, _user, loading, error] = useSignInWithGoogle(auth)


//     const signIn = async () => {
//         await signInWithGoogle()

//         //using something called localStorage which is essentially just JS temporary storage (very similar to SQLite in Python)
//         localStorage.setItem('auth', 'true')
//         onAuthStateChanged(auth, (user) => {

//             if (user) {
//                 localStorage.setItem('user', user.email || '')//will be using this later to store our items on a specific user but also make API calls
//                 localStorage.setItem('token', user.uid || '')
//                 setMessage(`Successfully logged in ${user.email}`)
//                 setMessageType('success')
//                 setOpen(true)
//                 setTimeout(() => { navigate('/shop') }, 2000) //will display successfull message to user & then navigate to shop
//             }
//         })

//         if (error) {
//             setMessage(error.message)
//             setMessageType('error')
//             setOpen(true)
//         }

//         if (loading) {
//             return <CircularProgress />
//         }
//     }

//     return (
//         <Box>
//             <Button
//                 variant='contained'
//                 color='info'
//                 size='large'
//                 sx={authStyles.button}
//                 onClick={signIn}
//             >
//                 Sign In With Google
//             </Button>
//             <Snackbar
//                 open={open}
//                 autoHideDuration={3000}
//                 onClose={() => setOpen(false)}
//             >
//                 <Alert severity={messageType}>
//                     {message}
//                 </Alert>
//             </Snackbar>
//         </Box>
//     )

// }


const SignIn = () => {
    //setting up our hooks
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState<string>('')
    const [messageType, setMessageType] = useState<MessageType>()
    const navigate = useNavigate() // instantiate that useNavigate() object to use
    const auth = getAuth() //essentially monitoring the state of our authorization
    const { register, handleSubmit } = useForm<SubmitProps>({})

    const onSubmit: SubmitHandler<SubmitProps> = async (data, event) => {
        if (event) event.preventDefault();

        console.log(data.email, data.password)
        signInWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                // Signed in 
                localStorage.setItem('auth', 'true')
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        localStorage.setItem('token', user.uid || '') //setup cart database & for api calls to our backend
                        localStorage.setItem('user', user.email || '') //using this on our navbar 
                        localStorage.setItem('organizer', data.organizer ? 'true' : 'false')
                        localStorage.setItem('username', data.username)
                    }
                })
                const user = userCredential.user;
                // Once a user is signed in we can display a success message
                setMessage(`Successfully logged in user ${user.email}`)
                setMessageType('success')
                setOpen(true)
                setTimeout(() => { navigate('/tournaments') }, 2000)
            })
            .catch((error) => {
                const errorMessage = error.message;
                setMessage(errorMessage)
                setMessageType('error')
                setOpen(true)
            });
    }

    return (
        <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Typography variant='h6'>Sign Into Your Account</Typography>
                <Box>
                    <label htmlFor="email">Email</label>
                    <input {...register('email')} name='email' placeholder='Email Here' />
                    <label htmlFor="password">Password</label>
                    <input {...register('password')} name='password' placeholder='Password here' />
                </Box>
                <Button type='submit'>Submit</Button>
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

interface User {
    id: string
    username: string
    firstName: string
    lastName: string
    email: string
    password: string
    phone: string
    organizer: boolean
}

const SignUp = () => {
    //setting up our hooks
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState<string>('')
    const [messageType, setMessageType] = useState<MessageType>()
    const navigate = useNavigate() // instantiate that useNavigate() object to use
    const auth = getAuth() //essentially monitoring the state of our authorization
    const { register, handleSubmit, control, formState:{errors} } = useForm<SubmitProps>({})

    const onSubmit: SubmitHandler<SubmitProps> = async (data, event) => {
        if (event) event.preventDefault();
        console.log(data)

        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                // Signed in 
                localStorage.setItem('auth', 'true')
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        localStorage.setItem('token', user.uid || '') //setup cart database & for api calls to our backend
                        localStorage.setItem('user', user.email || '') //using this on our navbar 
                        localStorage.setItem('organizer', data.organizer.toString())
                        console.log(localStorage.getItem('organizer'))
                        localStorage.setItem('username', data.username)
                        const newUser: User = {
                            id: localStorage.getItem('token') as string,
                            username: data.username,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            email: data.email,
                            password: data.password,
                            phone: data.phone,
                            organizer: data.organizer
                        }
                        const db = getDatabase()
                        const userRef = ref(db, `users/${newUser.id}/`)
                        set(userRef, newUser)
                        .then(() => {
                            // Data was successfully added to the database
                            console.log('User data added to the database');
                          })
                          .catch((error) => {
                            // Handle any errors that occur during the database operation
                            console.error('Error adding user data:', error);
                          });

                    }
                })
                const user = userCredential.user;
                // Once a user is signed in we can display a success message
                setMessage(`Successfully logged in user ${user.email}`)
                setMessageType('success')
                setOpen(true)
                setTimeout(() => { navigate('/tournaments') }, 2000)
            })
            .catch((error) => {
                const errorMessage = error.message;
                setMessage(errorMessage)
                setMessageType('error')
                setOpen(true)
            });
    }

    return (
        <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Typography variant='h6'>Sign Up</Typography>
                <Box>
                    <label htmlFor="username">Username</label>
                    <Controller
                        name='username'
                        control={control}
                        rules={{ required: 'Username is required'}}
                        defaultValue=''
                        render={({field}) => <InputText {...field} value={field.value} onChange={field.onChange} name='username' placeholder='CamelliaLover573' />}
                    />
                    {errors.username && <p>{errors.username.message}</p>}
                    <label htmlFor="firstname">First Name</label>
                    <Controller
                        name='firstName'
                        control={control}
                        rules={{ required: 'First Name is required'}}
                        defaultValue=''
                        render={({field}) => <InputText {...field} value={field.value} onChange={field.onChange} name='firstname' placeholder='MEGA' />}
                    />
                    {errors.firstName && <p>{errors.firstName.message}</p>}
                    <label htmlFor="lastname">Last Name</label>
                    <Controller
                        name='lastName'
                        control={control}
                        rules={{ required: 'Last Name is required'}}
                        defaultValue=''
                        render={({field}) => <InputText {...field} value={field.value} onChange={field.onChange} name='lastname' placeholder='Sampling Masters' />}
                    />
                    {errors.lastName && <p>{errors.lastName.message}</p>}
                    <label htmlFor="email">Email</label>
                    <Controller
                        name='email'
                        control={control}
                        rules={{ required: 'Email is required'}}
                        defaultValue=''
                        render={({field}) => <InputText {...field} value={field.value} onChange={field.onChange} name='email' placeholder='bemani@hotmail.com' />}
                    />
                    {errors.email && <p>{errors.email.message}</p>}
                    <label htmlFor="password">Password</label>
                    <Controller
                        name='password'
                        control={control}
                        rules={{ required: 'Password is required'}}
                        defaultValue=''
                        render={({field}) => <InputPassword {...field} value={field.value} onChange={field.onChange} name='password' placeholder='at least 8 characters: 1 upper letter 1 lower letter and 1 (@#$%^&+=!)' />}
                    />
                    {errors.password && <p>{errors.password.message}</p>}
                    <label htmlFor="phone-number">Phone Number</label>
                    <Controller
                        name='phone'
                        control={control}
                        rules={{ required: 'Phone Number is required'}}
                        defaultValue=''
                        render={({field}) => <InputText {...field} value={field.value} onChange={field.onChange} name='phone' placeholder='1-420-369-4842' />}
                    />
                    {errors.phone && <p>{errors.phone.message}</p>}
                    <label htmlFor="organizer">Are you a Tournament Organizer?</label>
                    <label>
                        <input
                        type="radio"
                        value="true"
                        {...register('organizer', { required: 'Please select an option' })}
                        /> Yes
                    </label>
                    <label>
                        <input
                        type="radio"
                        value="false"
                        {...register('organizer', { required: 'Please select an option' })}
                        /> No
                    </label>
                    {errors.organizer && <p>{errors.organizer.message}</p>}
                    {/* <InputPassword {...register('password')} name='password' placeholder='Password must be 6 or more characters' />
                    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=.*[a-zA-Z]).{8,}$/ */}
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

export const Auth = (props: Props) => {
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
                    <Typography variant='h5'>Please either Sign In or Sign Up</Typography>
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
                            Email Login
                        </Button>
                        <Button
                            variant='contained'
                            color='primary'
                            size='large'
                            sx={authStyles.button}
                            onClick={() => { setOpen(true); setSignType('signup') }}
                        >
                            Email Sign Up
                        </Button>
                    </Stack>
                </Stack>
                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogContent>
                        {signType === 'signin' ? <SignIn /> : <SignUp />}
                    </DialogContent>
                </Dialog>
            </Box>
        </Box>
    )
}