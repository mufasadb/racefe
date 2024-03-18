import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

const CreateLeague = ({ userId }) => {
  const [league, setLeague] = useState('')
  const [existingLeagues, setExistingLeagues] = useState([])
  const [scoreMultiplier, setScoreMultiplier] = useState(1)

  useEffect(() => {
    const fetchLeagues = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/leagues/`, {
        credentials: 'include'
      })
      const data = await response.json()
      console.log(data)
      setExistingLeagues(data)
    }

    // fetchScoringObjects()
    fetchLeagues()
  }, [])

  const handleLeagueChange = event => {
    setLeague(event.target.value)
  }

  const handleScoreMultiplierChange = event => {
    setScoreMultiplier(event.target.value)
  }

  const handleSubmit = event => {
    event.preventDefault()


    // Use FormData to send the file as binary data
    // const formData = new FormData()
    const data = {
      name: league,
      score_multiplier: scoreMultiplier
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/leagues/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        credentials: 'include'
      },
      body: JSON.stringify(data)
      // credentials: 'include'
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.log(error))
  }

  return (
    <div className='ScoreSubmission'>
      <h1>Create a new League</h1>
      <h2>Existing Leagues</h2>
      <ul>
        {existingLeagues.map(league => (
          <li key={league.id}>
            <span className='league-name'>Name: {league.name}</span>
            <span className='league-multiplier'>
              Multiplier: {league.scoreMultiplier}
            </span>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <div>
          <div>
            <label htmlFor='league'>League Name:</label>
            <input
              type='text'
              id='league'
              name='league'
              onChange={handleLeagueChange}
              value={league}
            />
          </div>
          <div>
            <label htmlFor='scoreMultiplier'>Score multiplier</label>
            <input
              type='number'
              id='scoreMultiplier'
              name='scoreMultiplier'
              onChange={handleScoreMultiplierChange}
              value={scoreMultiplier}
            />
          </div>
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default CreateLeague
