import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import UserContext from '../context/UserContext'

const ScoringSubmission = () => {
  const { userId, teamId, isAdmin, isLoggedIn, isTeamLeader } =
    React.useContext(UserContext)

  console.log(userId, teamId, isAdmin, isLoggedIn, isTeamLeader)
  // console.log(userId)
  const [scoreableObjectID, setScoreableObjectID] = useState('')
  const [leagueID, setLeagueID] = useState('')
  const [teamID, setTeamID] = useState('')
  const [userID, setUserID] = useState('')
  const [characterID, setCharacterID] = useState('')
  const [evidenceURL, setEvidenceURL] = useState('')
  const [isApproved, setIsApproved] = useState(false)
  const [scoreableObjects, setScoreableObjects] = useState([])
  const [leagues, setLeagues] = useState([])
  const [selectedScoreable, setSelectedScoreable] = useState({})
  const [users, setUsers] = useState([])
  const [teams, setTeams] = useState([])
  // Fetch scoreable objects
  useEffect(() => {
    const fetchScoreableObjects = async () => {
      if (isTeamLeader) {
      } else {
        try {
          const responses = await Promise.all([
            fetch(
              `${process.env.REACT_APP_BACKEND_URL}${
                process.env.REACT_APP_BACKEND_PORT
              }/scoreable-objects/available/player-bounties/${
                userId ? userId : 1
              }`
            ),
            fetch(
              `${process.env.REACT_APP_BACKEND_URL}${
                process.env.REACT_APP_BACKEND_PORT
              }/scoreable-objects/available/team-bounties/${
                teamId ? teamId : 1
              }`
            ),
            fetch(
              `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/scoreable-objects/available/league-bounties`
            )
          ])
          const data = await Promise.all(responses.map(res => res.json()))
          setScoreableObjects(data.flat())
          setSelectedScoreable(scoreableObjects[0].id)
        } catch (error) {
          console.error(error)
        }
      }
    }

    const fetchLeagues = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/leagues`
        )
        const data = await response.json()
        setLeagues(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchScoreableObjects()
    fetchLeagues()
  }, [teamId, userId])

  useEffect(() => {
    // Fetch users and teams
    const fetchUsersAndTeams = async () => {
      try {
        const usersResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/users/`
        )
        const teamsResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/teams/`
        )
        const usersData = await usersResponse.json()
        const teamsData = await teamsResponse.json()
        setUsers(usersData)
        setTeams(teamsData)
        setTeamID(teamId)
        setUserID(userId)
      } catch (error) {
        console.error(error)
      }
    }

    fetchUsersAndTeams()
    // ... other fetch calls
  }, [teamId, userId])

  const handleScoreableChange = e => {
    console.log(e.target.value)
    console.log(scoreableObjects)
    const selected = scoreableObjects.find(obj => obj.id == e.target.value)
    console.log(selected)
    setSelectedScoreable(selected || {})
    setScoreableObjectID(e.target.value)
  }

  const handleSubmit = event => {
    //check if all fields are full
    if (!scoreableObjectID || !leagueID || !evidenceURL) {
      alert('Please fill out all fields')
      return
    }

    event.preventDefault()

    const data = {
      scoreable_object_id: parseInt(scoreableObjectID),
      league_id: parseInt(leagueID),
      team_id: teamID || null,
      user_id: userID || null,
      character_id: characterID || null,
      evidence_url: evidenceURL,
      is_approved: isAdmin ? isApproved : false // Only set if admin
    }

    console.log(data)
    // Replace with your API endpoint
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/scoring-events/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    )
      .then(res => {
        if (res.status == 400) {
          //show alert with error message
          alert('Error: ' + res)
        }
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`)
        }
        return res.json()
      })
      .then(res => {
        window.location.reload()
      })

      // .then(data => console.log(data))
      .catch(error => console.log(error))
  }

  const convertToHumanReadable = scoreableType => {
    switch (scoreableType) {
      case 'player_bounty':
        return 'Player Bounty'
      case 'team_bounty':
        return 'Team Bounty'
      case 'league_bounty':
        return 'League Bounty'
      case 'server_bounty':
        return 'Server Bounty'
      default:
        return 'Unknown'
    }
  }

  return (
    <div style={{ display: 'flex' }}>
      <form onSubmit={handleSubmit} style={{ flex: 1 }}>
        <div className='form-field'>
          <label htmlFor='scoreableObjectID'>Select your scoreable:</label>
          <select
            id='scoreableObjectID'
            value={scoreableObjectID}
            onChange={handleScoreableChange}
            required
          >
            <option key='' value=''>
              Select a scoreable
            </option>

            {scoreableObjects.map(obj => (
              <option key={obj.id} value={obj.id}>
                {obj.name}
              </option>
            ))}
          </select>
        </div>
        <div className='form-field'>
          <label htmlFor='leagueID'>League:</label>

          <select
            id='leagueID'
            value={leagueID}
            onChange={e => setLeagueID(e.target.value)}
            required
          >
            <option key='' value=''>
              Select a league
            </option>
            {leagues.map(league => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </select>
        </div>

        <div className='form-field'>
          <label htmlFor='teamID'>Team:</label>
          <select
            id='teamID'
            value={teamID || teamId} // Defaults to context teamId if teamID state is not set
            onChange={e => setTeamID(e.target.value)}
            disabled={!isAdmin}
          >
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div className='form-field'>
          <label htmlFor='userID'>User:</label>
          <select
            id='userID'
            value={userID || userId} // Defaults to context userId if userID state is not set
            onChange={e => setUserID(e.target.value)}
            disabled={!isAdmin}
          >
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        {/* <div>
        <label htmlFor='characterID'>Character ID:</label>
        <input
          id='characterID'
          type='number'
          value={characterID}
          onChange={e => setCharacterID(e.target.value)}
        />
      </div> */}

        <div className='form-field'>
          <label htmlFor='evidenceURL'>Evidence URL:</label>
          <input
            id='evidenceURL'
            type='text'
            value={evidenceURL}
            onChange={e => setEvidenceURL(e.target.value)}
          />
        </div>

        {isAdmin && (
          <div>
            <label htmlFor='isApproved'>Is Approved:</label>
            <input
              id='isApproved'
              type='checkbox'
              checked={isApproved}
              onChange={e => setIsApproved(e.target.checked)}
            />
          </div>
        )}

        <button type='submit'>Submit Scoring</button>
      </form>

      <div
        style={{
          flex: 1,
          marginLeft: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          backgroundColor: '#333', // Dark background for the card
          color: '#fff', // Light text for readability
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
        }}
      >
        {selectedScoreable.name ? (
          <>
            <h2
              style={{
                margin: 0,
                backgroundColor: '#007bff', // Slightly lighter blue for the header
                color: 'white',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              {selectedScoreable.name}
            </h2>
            <div
              style={{
                border: '1px solid #555', // Border color for contrast
                borderRadius: '8px',
                padding: '10px',
                backgroundColor: '#222' // Even darker background for the description
              }}
            >
              {selectedScoreable.description}
            </div>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: '#555', // Dark background for the pill
                borderRadius: '999px',
                padding: '5px 10px',
                fontWeight: 'bold'
              }}
            >
              Multiplier: {selectedScoreable.leagueMultiplier ? 'yes' : 'no'}
            </span>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: '#555', // Matching dark background for the pill
                borderRadius: '999px',
                padding: '5px 10px',
                fontWeight: 'bold'
              }}
            >
              Type: {convertToHumanReadable(selectedScoreable.submittableType)}
            </span>
          </>
        ) : (
          <p style={{ textAlign: 'center' }}>No bounty selected</p>
        )}
      </div>
    </div>
  )
}

export default ScoringSubmission
