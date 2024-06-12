'use client'
import React, { useEffect, useState } from 'react';
import { Container, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Typography, 
  ListItemSecondaryAction 
} from '@mui/material';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';



interface User {
  _id?: string;
  name: string;
  email: string;
  number?: number;
}


const API_URL ='http://localhost:3800/api/users';


const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Inavlid email").required("Email required"),
  number: yup.number()
})



const UserPage = () => {

  const { control, handleSubmit, setValue, reset } = useForm<User>({
    resolver: yupResolver(schema),
  })


  const [users, setUsers] = useState<User[]>([]);
  const [updatingUser, setUpdatingUser] = useState<User | null>(null);


  const fetchUsers = async () => {
    const response = await axios.get(`${API_URL}`);
    setUsers(response.data);
  }

  useEffect(() => {
    fetchUsers();
  }, [])


  const onSubmit = async (data: User) => {
    if (updatingUser) {
      await axios.put(`${API_URL}/${updatingUser._id}`, data);
      setUpdatingUser(null);
    }
    else {
      await axios.post(`${API_URL}`, data);
    }

    fetchUsers()
    reset()
  }

  const updateUser = (user: User) => {
    setUpdatingUser(user);
    setValue('name', user.name);
    setValue('email', user.email);
    setValue('number', user.number);
  }

  const deleteUser = async (id?: string) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchUsers();
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Name"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error ? error.message : ''}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Email"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error ? error.message : ''}
            />
          )}
        />
        <Controller
          name="number"
          control={control}
          defaultValue={0}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Number"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error ? error.message : ''}
            />
          )}
        />
        <Button type="submit" variant="contained" color="primary">
          {updatingUser ? 'Update User' : 'Add User'}
        </Button>
      </form>
      <div style={{border:'black'}}>
      <List>
        {users.map((user) => (
          <ListItem key={user._id} alignItems="flex-start">
            <ListItemText
              primary={
                <>
                  <Typography variant="h6" color='textPrimary'>{user.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{user.email}</Typography>
                  <Typography variant="body2" color="textSecondary">{user.number}</Typography>
                </>
              }
            />
            <ListItemSecondaryAction>
              <IconButton onClick={() => updateUser(user)} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => deleteUser(user._id)} color="secondary">
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      </div>
    </Container>
  );
};

export default UserPage