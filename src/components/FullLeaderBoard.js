import React, { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material'

const LeaderBoard = () => {
  const [leaderboardData, setLeaderboardData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/dashboard-data/leader-board`
      )
      const data = await response.json()
      setLeaderboardData(data) // Assuming the data is an array and taking the top 10
    }

    fetchData().catch(console.error)
  }, [])

  return (
    <TableContainer >
      <Table aria-label='Leaderboard Table'>
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>Account</TableCell>
            <TableCell>Team</TableCell>
            <TableCell>Score</TableCell>
            {/* <TableCell>Submission Count</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {leaderboardData.map((user, index) => (
            <TableRow key={index }>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>
                <Chip
                  label={user.teamName}
                  style={{ backgroundColor: user.teamColour }}
                />
              </TableCell>
              <TableCell>{user.score}</TableCell>
              {/* <TableCell>{user.scoredEventsCount}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default LeaderBoard
