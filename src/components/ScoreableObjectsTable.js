import React, { useState, useEffect } from 'react'
import { IconButton } from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'

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
      setScoreableEvents(data)
      console.log(data)
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
        window.alert(`There was an error deleting the scoreable object /n ${res.message}`)
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

  const paginate = pageNumber => setCurrentPage(pageNumber)

  return (
    <div>
      <h2>Existing Scoreable Events</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Requires Evidence</th>
            <th>League Multiplier</th>
            <th>Points</th>
            <th>submittable_type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEvents.map(event => (
            <tr key={event.id}>
              <td>{event.name}</td>
              <td>{event.description}</td>
              <td>{event.requiresEvidence ? 'Yes' : 'No'}</td>
              <td>{event.leagueMultiplier ? 'Yes' : 'No'}</td>
              <td>{event.points}</td>
              <td>{event.submittableType}</td>
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
