import React, { useState, useEffect } from 'react'
import { Paper, Typography, Grid, Box, Chip } from '@mui/material'

const TeamComparison = () => {
  const [teamData, setTeamData] = useState([])

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

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/dashboard-data/team-comparison`
    )
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => setTeamData(data))
      .catch(err => console.error('Error fetching team data:', err))
  }, [])

  const isHighestValue = (value, valuesArray, invert = false) =>
    invert
      ? value === Math.min(...valuesArray)
      : value === Math.max(...valuesArray)

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant='h6' gutterBottom component='div'>
        Team Comparison
      </Typography>
      <Grid container spacing={2}>
        {teamData.map(team => (
          <Grid item xs={12} md={6} key={team.teamName}>
            <Box
              className='team-card'
              sx={{
                p: 2,
                border: '1px solid gray',
                borderRadius: '4px',
                bgcolor: '#2a2a2a', // Dark background
                color: 'white', // White text
                '&:hover': {
                  transform: 'scale(1.05)', // Grow effect on hover
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)' // Shadow on hover
                },
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease'
              }}
            >
              <Chip
                style={{ backgroundColor: team.teamColour }}
                label={team.teamName}
              >
                {/* <Typography
                  variant='subtitle1'
                  component='div'
                  sx={{ color: 'white', textAlign: 'center', mb: 1 }}
                > */}
                {/* </Typography>{' '} */}
              </Chip>
              <div className='category-row'>
                <Typography className='category-label'>
                  Total Points:
                </Typography>
                <Typography
                  className={`category-value ${
                    isHighestValue(
                      team.totalPoints,
                      teamData.map(t => t.totalPoints)
                    )
                      ? 'highest-value'
                      : ''
                  }`}
                >
                  {team.totalPoints}
                </Typography>
              </div>
              <div className='category-row'>
                <Typography className='category-label'>
                  {' '}
                  Scored Events:
                </Typography>
                <Typography
                  className={`category-value ${
                    isHighestValue(
                      team.totalScoringEvents,
                      teamData.map(t => t.totalScoringEvents)
                    )
                      ? 'highest-value'
                      : ''
                  }`}
                >
                  {' '}
                  {team.totalScoringEvents}
                </Typography>
              </div>
              <div className='category-row'>
                <Typography className='category-label'>
                  {' '}
                  Last Bounty:{' '}
                </Typography>
                <Typography
                  className={`category-value ${
                    isHighestValue(
                      team.claimedAt,
                      teamData.map(t => t.claimedAt)
                    )
                      ? 'highest-value'
                      : ''
                  }`}
                >
                  {' '}
                  {team.mostRecentBounty.name
                    ? team.mostRecentBounty.name
                    : 'N/A'}
                </Typography>
              </div>
              <div className='category-row'>
                <Typography className='category-label'> Claimed:</Typography>
                <Typography className='category-value'>
                  {' '}
                  {team.mostRecentBounty.claimedAt
                    ? timeAgo(new Date(team.mostRecentBounty.claimedAt))
                    : 'N/A'}
                </Typography>
              </div>
              <div className='category-row'>
                <Typography className='category-label'>
                  {' '}
                  Claimed By:{' '}
                </Typography>
                <Typography className='category-value'>
                  {' '}
                  {team.mostRecentBounty.username
                    ? team.mostRecentBounty.username
                    : 'N/A'}
                </Typography>
              </div>
              {/* <div className='category-row'>
                <Typography className='category-label'>
                  {' '}
                  Recent Contributor:{' '}
                </Typography>
                <Typography className='category-value'>
                  {' '}
                  {team.mostRecentContributer.username
                    ? team.mostRecentContributer.username
                    : 'N/A'}
                </Typography>
              </div> */}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}

export default TeamComparison
