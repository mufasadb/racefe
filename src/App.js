import React, { useState, useEffect } from 'react'
import { Container } from '@mui/material'
import { Route, Switch } from 'wouter'
import HomePage from './components/HomePage'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import PlayerData from './components/PlayerData'
import Header from './components/Header'
// import ScoreSubmission from './components/ScoreSubmission'
import CreateLeague from './components/CreateLeague'
import CreateTeam from './components/CreateTeam'
import CreateCharacter from './components/CreateCharacter'
import UserTable from './components/UserTable'
import CreateScoreableObject from './components/CreateScoreableObject'
import CreateScoringEvent from './components/CreateScoringEvent'
import LoginPage from './components/LoginPage'
import './App.css'
import UserContext from './context/UserContext'
import ScoringEventsReviewPage from './components/ScoringEventsReviewPage'
import ScoringEventsTable from './components/ScoringEventsTable'
import AllScoreablesList from './components/AllScoreablesList'
const LoggedInRoute = ({ component: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/auth/check`,
      {
        credentials: 'include'
      }
    )
      .then(response => response.json())
      .then(data => {
        setIsAuthenticated(data)
        if (!data) {
          // Redirect the user to the Discord login page
          let baseURL = 'https://discord.com/api/oauth2/authorize'
          let queryParams = `?client_id=1093461191705239562&redirect_uri=${encodeURIComponent(
            process.env.REACT_APP_BACKEND_URL +
              process.env.REACT_APP_BACKEND_PORT +
              '/auth/discord/callback'
          )}&response_type=code&scope=identify email`

          let discordURL = baseURL + queryParams
          window.location.href = discordURL
        }
      })
  }, [])
  if (isAuthenticated === null) {
    ;<div>Loading...</div>
  }
  return (
    <Component />
    // <Route
    //   {...rest}
    //   render={props => (isAuthenticated ? <Component {...props} /> : null)}
    // />
  )
}

const AdminOnlyRoute = ({ component: Component, ...rest }) => {
  const [isAdmin, setIsAdmin] = useState(null)
  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/user`,
      {
        credentials: 'include'
      }
    )
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        if (data.role === 'admin') {
          setIsAdmin(true)
        }
        if (!data) {
          // Redirect the user to the Discord login page
          window.location.href = `${process.env.REACT_APP_FRONTEND_URL}${process.env.REACT_APP_FRONTEND_PORT}/`
        }
      })
  }, [])
  if (isAdmin === null) {
    ;<div>Loading...</div>
  }
  return <Component />
}

const theme = createTheme({
  palette: {
    mode: 'dark'
  }
})

const App = () => {
  const [userId, setuserId] = useState(/* initial player ID */)
  const [teamId, setTeamId] = useState(/* initial team ID */)
  const [isAdmin, setIsAdmin] = useState(/* initial admin status */)
  const [isTeamLeader, setIsTeamLeader] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Replace this with your code to fetch the player ID from your backend
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/user/`,
      {
        credentials: 'include'
      }
    )
      .then(res => {
        if (!res.status === 200) {
          throw new Error(`HTTP error! Status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        if (data) {
          setIsLoggedIn(true)
          setuserId(data.id)
          setTeamId(data.teamId)
          setIsTeamLeader(data.isTeamLeader)
          if (data.role === 'admin') {
            setIsAdmin(true)
          }
        }
      })
  }, [])

  return (
    <UserContext.Provider
      value={{ userId, teamId, isAdmin, isLoggedIn, isTeamLeader }}
    >
      <ThemeProvider theme={theme}>
        <div className='App'>
          <div style={{ justifyContent: 'center' }}>
            <img
              src='/ace_header.png'
              alt='Ace Header'
              style={{ maxWidth: '100%', height: '10em' }}
            />
          </div>
          <Header isLoggedIn={isLoggedIn} isAdmin={isAdmin} />{' '}
          {/* Pass the player ID to the Header component */}
          <Container>
            <Switch>
              <Route path='/' component={HomePage} />
              <AdminOnlyRoute path='/CreateLeague' component={CreateLeague} />
              <AdminOnlyRoute
                path='/CreateCharacter'
                component={CreateCharacter}
              />
              <AdminOnlyRoute path='/CreateTeam' component={CreateTeam} />
              <AdminOnlyRoute path='/Users' component={UserTable} />
              {/* <ProtectedRoute path='/player/:userId' component={PlayerData} /> */}
              <AdminOnlyRoute
                path='/CreateScoreableObject'
                component={CreateScoreableObject}
              />
              <AdminOnlyRoute
                path='/CreateScoringEvent'
                component={CreateScoringEvent}
              />
              <AdminOnlyRoute
                path='/ScoringEventsReviewPage'
                component={ScoringEventsReviewPage}
              />
              {/* <AdminOnlyRoute path='/player/:userId' component={PlayerData} /> */}
              <LoggedInRoute path='/playerData' component={PlayerData} />
              <LoggedInRoute path='/login' component={LoginPage} />
              <AdminOnlyRoute
                path='/ScoringEventsTable'
                component={ScoringEventsTable}
              />
              <Route path='/AllScoreablesList' component={AllScoreablesList} />
            </Switch>
          </Container>
        </div>
      </ThemeProvider>
    </UserContext.Provider>
  )
}

export default App
