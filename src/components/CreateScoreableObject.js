import React, { useState } from 'react'
import ScoreableObjectsTable from './ScoreableObjectsTable'
import Cookies from 'js-cookie'

const CreateScoreableObject = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [requiresEvidence, setRequiresEvidence] = useState(true)
  const [leagueMultiplier, setLeagueMultiplier] = useState(true)
  const [points, setPoints] = useState(1)
  const [submissionType, setSubmissionType] = useState('player_bounty')
  const handleSubmit = async object => {
    object.preventDefault()
    const data = {
      name,
      description,
      requires_evidence: requiresEvidence,
      league_multiplier: leagueMultiplier,
      points,
      submittable_type: submissionType
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/scoreable-objects/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),
          credentials: 'include'
        }
      )
      const res = await response.json()
      console.log(res)
      if (res.name) {
        window.location.reload()
      }
    } catch (error) {
      window.alert(error)
      console.log(error)
    }
  }

  return (
    <div>
      <h1>Create a new Scoreable Object</h1>
      <ScoreableObjectsTable />
      <form onSubmit={handleSubmit}>
        {/* Name input */}
        <div>
          <label htmlFor='name'>Object Name:</label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        {/* Description input */}
        <div>
          <label htmlFor='description'>Description:</label>
          <textarea
            id='description'
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        {/* Requires Evidence Checkbox */}
        <div>
          <label htmlFor='requiresEvidence'>Requires Evidence:</label>
          <input
            type='checkbox'
            id='requiresEvidence'
            checked={requiresEvidence}
            onChange={e => setRequiresEvidence(e.target.checked)}
          />
        </div>
        {/* League Multiplier Checkbox */}
        <div>
          <label htmlFor='leagueMultiplier'>League Multiplier:</label>
          <input
            type='checkbox'
            id='leagueMultiplier'
            checked={leagueMultiplier}
            onChange={e => setLeagueMultiplier(e.target.checked)}
          />
        </div>
        {/* Points input */}
        <div>
          <label htmlFor='points'>Points:</label>
          <input
            type='number'
            id='points'
            value={points}
            onChange={e => setPoints(parseInt(e.target.value, 10))}
          />
        </div>
        <select onChange={e => setSubmissionType(e.target.value)}>
          <option value='character'>Character</option>
          <option value='player'>Player</option>
          <option value='player_bounty'>Player Bounty</option>
          <option value='team_bounty'>Team Bounty</option>
          <option value='server_bounty'>Server</option>
        </select>
        <div></div>
        {/* Submit button */}
        <br></br>
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default CreateScoreableObject
