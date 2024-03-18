// Additional imports
import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import DeleteIcon from '@mui/icons-material/Delete'

const UserTable = () => {
  const [users, setUsers] = useState([])
  const [teams, setTeams] = useState([])
  const [teamCount, setTeamCount] = useState([])

  useEffect(() => {
    // Fetch users
    fetchUsers()
    fetchTeams()
    // Fetch teams
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/users/`,
        {
          credentials: 'include'
        }
      )
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        // Handle HTTP errors
        console.error('HTTP Error: ', response.statusText)
      }
    } catch (error) {
      console.error('Fetching users failed: ', error)
    }
  }

  const fetchTeams = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/teams/`,
        {
          credentials: 'include'
        }
      )
      if (response.ok) {
        const data = await response.json()
        setTeams(data)
      } else {
        // Handle HTTP errors
        console.error('HTTP Error: ', response.statusText)
      }
    } catch (error) {
      console.error('Fetching teams failed: ', error)
    }
  }

  const handleTeamChange = async (userId, teamId) => {
    console.log(userId, teamId)
    // Handle team assignment for user
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/users/${userId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ team_id: teamId }),
          credentials: 'include'
        }
      )
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error data:', errorData)
        return
      }
      // If the update was successful, you may want to refresh the user list
      fetchUsers()
    } catch (error) {
      console.error('Error assigning team to user:', error)
    }
  }

  const handleRoleChange = async (userId, role) => {
    // Handle role change for user
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/users/${userId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ role }),
          credentials: 'include'
        }
      )
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error data:', errorData)
        return
      }
      // If the update was successful, you may want to refresh the user list
      fetchUsers()
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const handleDeleteUser = async userId => {
    // Handle user deletion
    const csrftoken = Cookies.get('csrftoken')
    try {
      await fetch(
        `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'X-CSRFToken': csrftoken
          },
          credentials: 'include'
        }
      )
      // If the deletion was successful, remove the user from the state
      setUsers(users.filter(user => user.id !== userId))
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  return (
    <div>
      <h1>User Management</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Team</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>
                <select
                  value={user.teamId || ''}
                  onChange={e =>
                    handleTeamChange(user.id, parseInt(e.target.value))
                  }
                >
                  <option value=''>Select a team</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  value={user.role}
                  onChange={e => handleRoleChange(user.id, e.target.value)}
                  disabled={user.role !== 'admin'}
                >
                  <option value='player'>Player</option>
                  <option value='team_leader'>Team Leader</option>
                  <option value='admin'>Admin</option>
                </select>
              </td>
              {user.role !== 'admin' && (
                <td>
                  <button onClick={() => handleDeleteUser(user.id)}>
                    <DeleteIcon />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserTable
