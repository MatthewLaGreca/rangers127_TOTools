import _React from 'react'
import { styled } from '@mui/system'
import { Button } from '@mui/material'
import { Link } from 'react-router-dom'

import { NavBar } from '../sharedComponents/NavBar' 
import bg from '../../assets/images/coups.jpg'
interface Props {
    title: string
}

// create some custom styled divs utilizing the styled import
const Root = styled('div')({
    padding: 0,
    margin: 0
})

const Main = styled('main')({
    backgroundImage: `linear-gradient(rgba(0, 0, 0, .3), rgba(0, 0, 0, .5)), url(${bg});`,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center top 5px',
    position: 'absolute',
    marginTop: '10px'
})

const MainText = styled('div')({
    textAlign: 'center',
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white'
})

export const Home = (props: Props) => {

    return (
        <Root>
            <NavBar />
            <Main>
                <MainText>
                    <h1> {props.title} </h1>
                    <Button sx={{ marginTop: '10px' }} component={Link} to={localStorage.getItem('auth') === 'true' ? '/tournaments' : '/auth'} variant='contained'>Let's get you ready to DANCE!</Button>
                </MainText>
            </Main>
        </Root>
    )
}