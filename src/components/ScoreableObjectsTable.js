import React, { useState, useEffect, useCallback } from 'react'
import { IconButton } from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { debounce } from 'lodash'

const ScoreableObjectsTable = () => {
  const [scoreableEvents, setScoreableEvents] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [eventsPerPage] = useState(10) // Adjust as needed

  useEffect(() => {
    const fetchScoreableEvents = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/scoreable-objects/`
      )
      const data = await response.json()
      const sortedData = data.sort((a, b) => a.sortOrder - b.sortOrder)
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
  //update scorablevents sort order, then debounce the api call
  const handleSortOrderChange = (scoreableObjectId, sortOrder) => {
    scoreableEvents.forEach(event => {
      if (event.id === scoreableObjectId) {
        event.sortOrder = sortOrder
      }
    })
    setScoreableEvents([...scoreableEvents])
    sendSortOrderToBackend(scoreableObjectId, sortOrder)
  }

  const handlePointChange = (scoreableObjectId, points) => {
    scoreableEvents.forEach(event => {
      if (event.id === scoreableObjectId) {
        event.points = points
      }
    })
    setScoreableEvents([...scoreableEvents])
    sendPointsToBackend(scoreableObjectId, points)
  }

  const sendSortOrderToBackend = useCallback(
    debounce(async (scoreableObjectId, sort_order) => {
      // Handle role change for user
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/scoreable-objects/${scoreableObjectId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sort_order: sort_order }),
            credentials: 'include'
          }
        )
        if (!response.ok) {
          const errorData = await response.json()
          console.error('Error data:', errorData)
          return
        }
        // If the update was successful, you may want to refresh the user list
        // fetchUsers()
      } catch (error) {
        console.error('Error updating user role:', error)
      }
    }, 500),
    []
  )
  const sendPointsToBackend = useCallback(
    debounce(async (scoreableObjectId, points) => {
      points = parseInt(points)
      // Handle role change for user
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/scoreable-objects/${scoreableObjectId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ points: points }),
            credentials: 'include'
          }
        )
        if (!response.ok) {
          const errorData = await response.json()
          console.error('Error data:', errorData)
          return
        }
        // If the update was successful, you may want to refresh the user list
        // fetchUsers()
      } catch (error) {
        console.error('Error updating user role:', error)
      }
    }, 500),
    []
  )

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
      <h2>Existing Scoreable Events</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Sort Order</th>
            <th>Requires Evidence</th>
            <th>League Multiplier</th>
            <th>Points</th>
            <th>Submission Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEvents.map(event => (
            <tr key={event.id}>
              <td>{event.name}</td>
              <td>{event.description}</td>
              <td>
                <input
                  type='number'
                  value={event.sortOrder}
                  onChange={e =>
                    handleSortOrderChange(event.id, e.target.value)
                  }
                />
              </td>
              <td>{event.requiresEvidence ? 'Yes' : 'No'}</td>
              <td>{event.leagueMultiplier ? 'Yes' : 'No'}</td>
              <td>
                <input
                  type='number'
                  value={event.points}
                  onChange={e => handlePointChange(event.id, e.target.value)}
                />
              </td>
              <td>{convertTypeToHumanReadable(event.submittableType)}</td>
              <td>
                <IconButton
                  onClick={() => handleDelete(event.id)}
                  aria-label='delete'
                >
                  <DeleteIcon />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={
            currentPage === Math.ceil(scoreableEvents.length / eventsPerPage)
          }
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default ScoreableObjectsTable
