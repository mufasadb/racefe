import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import UserContext from '../context/UserContext'
import { Popover, Paper, Typography } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import { Info } from '@mui/icons-material'

const ScoringSubmission = () => {
  const { userId, teamId, isAdmin, isLoggedIn, isTeamLeader } =
    React.useContext(UserContext)

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
  const [showPostURLs, setShowPostURLs] = useState(false)

  const [popoverData, setPopoverData] = useState({
    anchorEl: null,
    content: ''
  })

  const handlePopoverOpen = (event, description) => {
    setPopoverData({
      anchorEl: event.currentTarget,
      content: description
    })
  }

  const handlePopoverClose = () => {
    setPopoverData({
      anchorEl: null,
      content: ''
    })
  }

  const open = Boolean(popoverData.anchorEl)
  // Fetch scoreable objects
  useEffect(() => {
    const fetchScoreableObjects = async () => {
      if (userId === null || teamId === null) {
        return
      }
      try {
        const responses = await Promise.all([
          fetch(
            `${process.env.REACT_APP_BACKEND_URL}${
              process.env.REACT_APP_BACKEND_PORT
            }/scoreable-objects/available/player-bounties/${
              userID ? userID : userId
            }`
          ),
          fetch(
            `${process.env.REACT_APP_BACKEND_URL}${
              process.env.REACT_APP_BACKEND_PORT
            }/scoreable-objects/available/team-bounties/${
              teamID ? teamID : teamId
            }`
          )
        ])
        const data = await Promise.all(responses.map(res => res.json()))
        setScoreableObjects(data.flat())
        setSelectedScoreable(scoreableObjects[0].id)
      } catch (error) {
        console.error(error)
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
  }, [teamID, userID])

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
    const selected = scoreableObjects.find(obj => obj.id == e.target.value)
    setSelectedScoreable(selected || {})
    setScoreableObjectID(e.target.value)
  }

  const handleSubmit = event => {
    //check if all fields are full
    if (!scoreableObjectID || !leagueID) {
      alert('Please fill out all fields')
      return
    }

    event.preventDefault()

    const data = {
      scoreable_object_id: parseInt(scoreableObjectID),
      league_id: parseInt(leagueID),
      team_id: parseInt(teamID) || null,
      user_id: parseInt(userID) || null,
      character_id: characterID || null,
      evidence_url: evidenceURL,
      is_approved: isAdmin ? isApproved : false // Only set if admin
    }

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

      .catch(error => console.log(error))
  }

  const convertTypeToHumanReadable = scoreableType => {
    switch (scoreableType) {
      case 'character_objective':
        return 'Character Objective'
      case 'account_objective':
        return 'Account Objective'
      case 'team_objective':
        return 'Team Objective'
      case 'team_bounty':
        return 'Team Bounty'
      case 'account_bounty':
        return 'Account Bounty'
      default:
        return 'Unknown'
    }
  }
  const submitTypeExplenation = type => {
    switch (type) {
      case 'character_objective':
        return 'This objective can be completed once by each character'
      case 'account_objective':
        return 'This objective can be completed once by each account'
      case 'team_objective':
        return 'This objective can be completed once by each team'
      case 'team_bounty':
        return 'This bounty can only be claimed by a single team'
      case 'account_bounty':
        return 'This bounty can only be claimed by a single player'
      default:
        return 'Unknown'
    }
  }

  return (
    <div style={{ display: 'flex' }}>
      <form onSubmit={handleSubmit} style={{ flex: 1 }}>
        <div className='form-field'>
          <label htmlFor='scoreableObjectID'>Select objective:</label>
          <select
            id='scoreableObjectID'
            value={scoreableObjectID}
            onChange={handleScoreableChange}
            required
          >
            <option key='' value=''>
              Select an objective
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
            disabled={!isTeamLeader}
          >
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div className='form-field'>
          <label htmlFor='userID'>Account:</label>
          <select
            id='userID'
            value={userID || userId} // Defaults to context userId if userID state is not set
            onChange={e => setUserID(e.target.value)}
            disabled={!isTeamLeader}
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
        {selectedScoreable.requiresEvidence && (
          <div className='form-field'>
            <label htmlFor='evidenceURL'>
              Evidence URL:
              <InfoIcon
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup='true'
                onMouseEnter={e => {
                  {
                    handlePopoverOpen(
                      e,
                      "Upload a screenshot or video of the objective's completion we recommend https://imgur.com/upload for images and https://studio.youtube.com/ for videos, or simply the discord link to the ace media post"
                    )
                  }
                  {
                    setShowPostURLs(true)
                  }
                }}
                onMouseLeave={handlePopoverClose}
              />
            </label>
            <input
              id='evidenceURL'
              type='text'
              value={evidenceURL}
              onChange={e => setEvidenceURL(e.target.value)}
            />
          </div>
        )}

        {showPostURLs && (
          <div>
            <span>
              {' '}
              <a
                style={{ color: 'white' }}
                target='_'
                href='https://imgur.com/upload'
              >
                Imgur
              </a>{' '}
              and{' '}
              <a
                style={{ color: 'white' }}
                target='_'
                href='https://studio.youtube.com'
              >
                Youtube
              </a>{' '}
              <br />
            </span>
            <br />
            <br />
          </div>
        )}

        {isAdmin && (
          <div>
            <label htmlFor='isApproved'>Set as Approved (admin only):</label>
            <input
              id='isApproved'
              type='checkbox'
              checked={isApproved}
              onChange={e => setIsApproved(e.target.checked)}
            />
          </div>
        )}

        <button type='submit'>Submit Objective</button>
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
                backgroundColor: '#555', // Slightly lighter blue for the header
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
              aria-owns={open ? 'mouse-over-popover' : undefined}
              aria-haspopup='true'
              onMouseEnter={e =>
                handlePopoverOpen(
                  e,
                  "Does the League's Score Multiplier apply or will the score be just the value here"
                )
              }
              onMouseLeave={handlePopoverClose}
            >
              Multiplied By League?{' '}
              {selectedScoreable.leagueMultiplier ? 'Yes' : 'No'}
            </span>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: '#555', // Matching dark background for the pill
                borderRadius: '999px',
                padding: '5px 10px',
                fontWeight: 'bold'
              }}
              aria-owns={open ? 'mouse-over-popover' : undefined}
              aria-haspopup='true'
              onMouseEnter={e =>
                handlePopoverOpen(
                  e,
                  submitTypeExplenation(selectedScoreable.submittableType)
                )
              }
              onMouseLeave={handlePopoverClose}
            >
              submission Type:{' '}
              {convertTypeToHumanReadable(selectedScoreable.submittableType)}
            </span>
          </>
        ) : (
          <p style={{ textAlign: 'center' }}>No Objective Selected</p>
        )}
      </div>
      <PopoverComponent
        anchorEl={popoverData.anchorEl}
        open={open}
        onClose={handlePopoverClose}
        content={popoverData.content}
      />
    </div>
  )
}

const PopoverComponent = ({ anchorEl, open, onClose, content }) => {
  return (
    <Popover
      id='mouse-over-popover'
      sx={{ pointerEvents: 'none' }}
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
      disableRestoreFocus
    >
      <Paper elevation={3} style={{ padding: '10px' }}>
        <Typography>{content}</Typography>
      </Paper>
    </Popover>
  )
}

export default ScoringSubmission
