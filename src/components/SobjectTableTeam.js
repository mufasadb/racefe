import React, { useState, useEffect } from 'react'
import { IconButton } from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'

const PublicScoreableObjectsTable = () => {
  const [scoreableEvents, setScoreableEvents] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [eventsPerPage] = useState(10) // Adjust as needed

  useEffect(() => {
    const fetchScoreableEvents = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/scoreable-objects/`
      )
      const data = await response.json()
      const filteredData = data.filter(
        event =>
          event.submittableType !== 'account_bounty' &&
          event.submittableType !== 'account_objective' &&
          event.submittableType !== 'character_objective'
      )
      const sortedData = filteredData.sort((a, b) => a.sortOrder - b.sortOrder)
      setScoreableEvents(sortedData)
    }

    fetchScoreableEvents()
  }, [])
  const handleDelete = async id => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/scoreable-objects/${id}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      )
      const res = await response.json()
      if (res.status === 200) {
        window.location.reload()
      } else {
        window.alert(
          `There was an error deleting the scoreable object /n ${res.message}`
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  const indexOfLastEvent = currentPage * eventsPerPage
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage
  const currentEvents = scoreableEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  )
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
  const paginate = pageNumber => setCurrentPage(pageNumber)

  return (
    <div>
      <h2>Scoreable Events</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>League Multiplier</th>
            <th>Points</th>
            <th>Submittable Type</th>
          </tr>
        </thead>
        <tbody>
          {scoreableEvents.map(event => (
            <tr key={event.id}>
              <td>{event.name}</td>
              <td>{event.description}</td>
              <td>{event.leagueMultiplier ? 'Yes' : 'No'}</td>
              <td>{event.points}</td>
              <td>{convertTypeToHumanReadable(event.submittableType)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PublicScoreableObjectsTable
