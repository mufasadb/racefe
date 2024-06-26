import React, { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TableSortLabel
} from '@mui/material'
import { Check as CheckIcon, Delete as DeleteIcon } from '@mui/icons-material'
import UserContext from '../context/UserContext'

const ScoringEventsTable = () => {
  const { userId, teamId, isAdmin, isLoggedIn } = React.useContext(UserContext)
  const [scoringEvents, setScoringEvents] = useState([])
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('')

  useEffect(() => {
    const fetchScoringEvents = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/scoring-events/`
      )
      const data = await response.json()
      setScoringEvents(data)
    }

    fetchScoringEvents()
  }, [])

  // Sorting handlers
  const handleRequestSort = property => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const urlRegex = /^(https?:\/\/[^\s]+)/g
  const isHttpsUrl = url => {
    if (urlRegex.test(url) && url.startsWith('https://')) {
      return true
    }
  }

  const calculateTotalPoints = event => {
    let totalPoints = event.scoreableObject.leagueMultiplier
      ? event.scoreableObject.points * event.league.scoreMultiplier
      : event.scoreableObject.points
    //convert total points to a string and return it
    return totalPoints.toString()
  }

  // Approval and deletion handlers
  const handleApprove = id => {
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/scoring-events/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ is_approved: true })
      }
    ).then(() => {
      window.location.reload()
    })
  }

  const handleDelete = id => {
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/scoring-events/${id}`,
      {
        method: 'DELETE',
        credentials: 'include'
      }
    ).then(() => {
      window.location.reload()
    })
  }
  const columns = [
    { id: 'username', label: 'Account', minWidth: 170 },
    { id: 'teamName', label: 'Team Name', minWidth: 170 },
    { id: 'scoreableName', label: 'Submission', minWidth: 100 },
    { id: 'timestamp', label: 'Timestamp', minWidth: 170 },
    { id: 'isApproved', label: 'Approved', minWidth: 170 },
    { id: 'evidenceURL', label: 'Evidence URL', minWidth: 170 },
    { id: 'pointTotal', label: 'Score', minWidth: 170 }
  ]

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell key={column.id}>
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={orderBy === column.id ? order : 'asc'}
                  onClick={() => handleRequestSort(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scoringEvents.map(event => (
            <TableRow key={event.id}>
              <TableCell>
                {event.user.username ? event.user.username : ''}
              </TableCell>
              <TableCell>{event.team.name ? event.team.name : ''}</TableCell>
              <TableCell>{event.scoreableObject.name}</TableCell>
              <TableCell>{event.createdAt}</TableCell>
              <TableCell>{event.isApproved.toString()}</TableCell>
              <TableCell>
                {isHttpsUrl(event.evidenceUrl) ? (
                  <a
                    href={event.evidenceUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Link to Evidence
                  </a>
                ) : (
                  event.evidenceUrl
                )}
              </TableCell>
              <TableCell>{calculateTotalPoints(event)}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => handleApprove(event.id)}
                  color='primary'
                >
                  <CheckIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(event.id)}
                  color='secondary'
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ScoringEventsTable
