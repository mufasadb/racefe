import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

const ScoreSubmission = ({ userId }) => {
  const [scoringObjects, setScoringObjects] = useState([])
  const [selectedScoringObject, setSelectedScoringObject] = useState('')
  const [leagues, setLeagues] = useState([])
  const [selectedLeague, setSelectedLeague] = useState('')
  const [character, setCharacter] = useState('')
  const [file, setFile] = useState(null)

  useEffect(() => {
    if (userId) {
      // Fetch available leagues for the current player
      const fetchLeagues = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/leagues/`)
        const data = await response.json()
        setLeagues(data)
      }

      // fetchScoringObjects()
      fetchLeagues()
    }
  }, [userId])

  const handleScoringObjectChange = event => {
    setSelectedScoringObject(event.target.value)
  }

  const handleLeagueChange = event => {
    setSelectedLeague(event.target.value)
  }

  const handleCharacterChange = event => {
    setCharacter(event.target.value)
  }

  const handleFileChange = event => {
    setFile(event.target.files[0])
  }

  const handleSubmit = event => {
    event.preventDefault()

    // Use FormData to send the file as binary data
    const formData = new FormData()
    formData.append('scoreableObject', selectedScoringObject)
    formData.append('league', selectedLeague)
    formData.append('character', character)
    formData.append('file', file)

    fetch(`${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/score/submit-score/${userId}`, {
      method: 'POST',
      headers: {},
      body: formData,
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.log(error))
  }

  return (
    <div className='ScoreSubmission'>
      <h1>Submit Your Score</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='scoringObject'>Select Scoring Object:</label>
          <select
            name='scoringObject'
            id='scoringObject'
            onChange={handleScoringObjectChange}
            value={selectedScoringObject}
          >
            <option value=''>--Select--</option>
            {scoringObjects.map(scoringObject => (
              <option key={scoringObject.id} value={scoringObject.id}>
                {scoringObject.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor='league'>Select League:</label>
          <select
            name='league'
            id='league'
            onChange={handleLeagueChange}
            value={selectedLeague}
          >
            <option value=''>--Select--</option>
            {leagues.map(league => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor='character'>Character Name:</label>
          <input
            type='text'
            id='character'
            name='character'
            onChange={handleCharacterChange}
            value={character}
          />
        </div>
        <div>
          <label htmlFor='file'>Select a file:</label>
          <input
            type='file'
            id='file'
            name='file'
            onChange={handleFileChange}
          />
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default ScoreSubmission
