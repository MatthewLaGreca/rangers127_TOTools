import _React, { useState } from 'react'
import {
    Button,
    Drawer,
    ListItemButton,
    List,
    ListItemText,
    AppBar,
    Toolbar,
    IconButton,
    Stack, //this is a flexbox
    Typography,
    Divider, //just a line
    CssBaseline,
    Box //just a basic div
} from '@mui/material'
import { AddBox, OpenWith } from '@mui/icons-material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom'
import { signOut, getAuth } from 'firebase/auth'

// internal imports
import { theme } from '../../../Theme/themes'
import { Clock } from '../..';

//building a CSS object

const drawerWidth = 200;

const navStyles = {
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp, //number
            duration: theme.transitions.duration.leavingScreen //number
        })
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut, //number
            duration: theme.transitions.duration.enteringScreen //number
        })
    },
    menuButton: {
        marginRight: theme.spacing(2) //default is 8px, so 2x8 = 16px
    },
    hide: {
        display: 'none'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth
    },
    drawerHeader: {
        display: 'flex',
        width: drawerWidth,
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar, //spread operator is taking the rest of the properties from theme.mixins.toolbar
        justifyContent: 'flex-end'
    },
    content: {
        transition: theme.transitions.create('margin', { //shifting it back to original position
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        marginLeft: 0
    },
    contentShift: {
        transition: theme.transitions.create('margin', {  //shifting out content
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: 0
    },
    toolbar: {
        display: 'flex'
    },
    toolbarButton: {
        marginLeft: 'auto',
        backgroundColor: theme.palette.primary.contrastText
    },
    signInStack: {
        position: 'absolute',
        top: '20%',
        right: '50px'
    }
}

// build out our NavBar component
export const NavBar = () => {
    const navigate = useNavigate() //instantiating our useNavigate() hook
    const [open, setOpen] = useState(false)
    const myAuth = localStorage.getItem('auth')
    const auth = getAuth()


    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }

    const navLinks = [
        {
            text: 'Home',
            icon: <HomeIcon />,
            onClick: () => { navigate('/') }
        },
        {
            text: myAuth === 'true' ? 'Tournaments' : 'Sign In',
            icon: myAuth === 'true' ? <OpenWith /> : <AssignmentIndIcon />,
            onClick: () => { navigate(myAuth === 'true' ? '/tournaments' : '/auth') }
        },
        {
            text: myAuth === 'true' ? 'Create Tournament' : '',
            icon: myAuth === 'true' ? <AddBox /> : '',
            onClick: myAuth === 'true' ? () => { navigate('/manageevents') } : () => { }
        },
    ]

    let signInText = 'Sign In'

    if (myAuth === 'true') {
        signInText = 'Sign Out'
    }

    const signInButton = async () => {
        if (myAuth === 'false') {
            navigate('/auth')
        } else {
            await signOut(auth)
            localStorage.setItem('auth', 'false')
            localStorage.setItem('token', '')
            localStorage.setItem('user', '')
            navigate('/')
        }
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                sx={open ? navStyles.appBarShift : navStyles.appBar}
                position='fixed'
            >
                <Toolbar sx={navStyles.toolbar}>
                    <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        onClick={handleDrawerOpen}
                        edge='start'
                        sx={open ? navStyles.hide : navStyles.menuButton}
                    >
                        <OpenWith />
                    </IconButton>
                    <Typography variant='body1' sx={{ color: 'inherit', fontWeight: 'bold' }}>
                        TOTools
                    </Typography>
                    <Clock timezone='America/Chicago'/>
                </Toolbar>
                <Stack direction="row" justifyContent='space-between' alignItems='center' sx={navStyles.signInStack}>
                    <Typography variant='body2' sx={{ color: 'inherit' }}>
                        {localStorage.getItem('user')}
                    </Typography>
                    <Button
                        variant='outlined'
                        color='info'
                        size='large'
                        sx={{ marginLeft: '20px' }}
                        onClick={signInButton}
                    >
                        {signInText}
                    </Button>
                </Stack>
            </AppBar>
            <Drawer
                sx={open ? navStyles.drawer : navStyles.hide}
                variant='persistent'
                anchor='left'
                open={open}
            >
                <Box sx={navStyles.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        <OpenWith />
                    </IconButton>
                </Box>
                <Divider />
                <List>
                    {navLinks.map((item) => {
                        const { text, icon, onClick } = item
                        return (
                            <ListItemButton key={text} onClick={onClick}>
                                <ListItemText primary={text} />
                                {icon}
                            </ListItemButton>
                        )
                    })}
                </List>
            </Drawer>
        </Box>
    )
}