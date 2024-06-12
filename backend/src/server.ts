import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3800;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://ashish:Pass123@cluster0.llfdbsr.mongodb.net/crud-app');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    number: Number
});

const User = mongoose.model('User' , userSchema);


// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err:any) {
        res.status(500).json({ message: err.message });
    }
});

// Create new user
app.post('/api/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err : any) {
        res.status(400).json({ message: err.message });
    }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (err:any) {
        res.status(400).json({ message: err.message });
    }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (err : any) {
        res.status(500).json({ message: err.message });
    }
});
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
  