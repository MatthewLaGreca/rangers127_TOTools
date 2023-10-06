import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { FirebaseAppProvider } from 'reactfire'
import 'firebase/auth'
import { firebaseConfig } from './firebaseConfig'

//internal imports
import { Home, Auth, ManageEvents, Test, Events } from './components'
import './index.css'
import { theme } from './Theme/themes'
// import { firebaseConfig } from './firebaseConfig' //need to make Firebase config

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path='/' element={<Home title = {'Welcome to TOTools!'} />}/>
            <Route path='/auth' element={<Auth title = "We da best music!"/>}/>
            <Route path='/manageevents' element={<ManageEvents title = "We da best music!"/>}/>
            <Route path='/test' element={<Test title = "We da best music!"/>}/>
            <Route path='/tournaments' element={<Events/>}/>
          </Routes>
        </Router>
      </ThemeProvider>
    </FirebaseAppProvider>
  </React.StrictMode>,
)