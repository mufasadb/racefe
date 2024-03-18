// Additional imports
import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

const CreateCharacter = () => {
  const [characterName, setCharacterName] = useState('')
  const [users, setUsers] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [ownerUserId, setOwnerUserId] = useState('')

  useEffect(() => {
    fetchUsers()
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/admin/check`, {
      credentials: 'include'
    }).then(res => res.json())
    if (response.isAdmin) {
      setIsAdmin(true)
      ownerUserId = response.userId
    }
  }

  const fetchUsers = async () => {
    // Fetch the list of users from the backend, this is a placeholder
    // You need to implement the actual fetch request according to your backend API
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/users/`, {
      credentials: 'include'
    })
    const data = await response.json()
    setUsers(data)
    console.log(data);
  }

  const handleCharacterNameChange = event => {
    setCharacterName(event.target.value)
  }

  const handleOwnerUserIdChange = event => {
    setOwnerUserId(event.target.value)
  }

  const handleSubmit = async event => {
    event.preventDefault()
    const csrftoken = Cookies.get('csrftoken')

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/characters/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({ name: characterName, user_id: ownerUserId }),
        credentials: 'include'
      })

      const data = await response.json()
      console.log(data)
      // Handle success
    } catch (error) {
      console.error('Error creating character:', error)
      // Handle error
    }
  }

  return (
    <div className='CharacterCreation'>
      <h1>Create a new Character</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='characterName'>Character Name:</label>
          <input
            type='text'
            id='characterName'
            name='characterName'
            value={characterName}
            onChange={handleCharacterNameChange}
          />
        </div>
        <div>
          <label htmlFor='ownerUserId'>Owner User:</label>
          {isAdmin ? (
            <select
              id='ownerUserId'
              name='ownerUserId'
              value={ownerUserId}
              onChange={handleOwnerUserIdChange}
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          ) : (
            <input
              type='text'
              id='ownerUserId'
              name='ownerUserId'
              value = 'something'
              // value={users? users.find(user => user.id === ownerUserId).username : ''}
              disabled={true}
            />
          )}
        </div>
        <button type='submit'>Create Character</button>
      </form>
    </div>
  )
}

export default CreateCharacter
