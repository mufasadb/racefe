import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import UserContext from '../context/UserContext'

const ScoredObjects = () => {
  const { userId, teamId, isAdmin, isLoggedIn } = React.useContext(UserContext)

  const [scoreableObjects, setScoreableObjects] = useState([])

  useEffect(() => {
    fetchScoreableObjects()
  }, [])

  const fetchScoreableObjects = async () => {
    try {
      const responses = await Promise.all([
        fetch(
          `${process.env.REACT_APP_BACKEND_URL}${
            process.env.REACT_APP_BACKEND_PORT
          }/scoring-events/by-user/${userId ? userId : 1}`
        )
      ])
      const data = await Promise.all(responses.map(res => res.json()))
      setScoreableObjects(data.flat())
      
    } catch (error) {
      console.error(error)
    }
  }
  function timeAgo (date) {
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInDays > 0) {
      return `${diffInDays} day(s) ago`
    } else if (diffInHours > 0) {
      return `${diffInHours} hour(s) ago`
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute(s) ago`
    } else {
      return 'Just now'
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label='Available Scoreable Objects'>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Points</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Is Approved</TableCell>
            {/* Add other relevant columns as needed */}
          </TableRow>
        </TableHead>
        <TableBody>
          {scoreableObjects.map((object, index) => (
            <TableRow key={index}>
              <TableCell>{object.scoreableObject.name}</TableCell>
              <TableCell>{object.scoreableObject.description}</TableCell>
              <TableCell>{object.pointTotal}</TableCell>
              <TableCell>{object.createdAt ? timeAgo(new Date(object.createdAt)):''}</TableCell>
              <TableCell>{object.isApproved? "Approved" : "Not Yet Approved"}</TableCell>
              {/* Render other object properties as needed */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ScoredObjects
