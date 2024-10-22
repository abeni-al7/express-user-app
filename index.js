const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User = require('./models/User');

mongoose.connect('mongodb+srv://abenezeralebachew3:odTEqBsguaJr6Y86@cluster0.vxbaj.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
});

const validateUser = (req, res, next) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).send('Name and email are required');
    }
    next();
}

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).send('Error fetching users: ' + err.message);
    }
});

app.post('/users', validateUser, async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = new User({ name, email });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).send('Error creating user: ' + err.message);
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    } catch (err) {
        res.status(500).send('Error fetching user: ' + err.message);
    }
});

app.put('/users/:id', validateUser, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            email: req.body.email,
        }, { new: true });

        if (!user) return res.status(404).send('User not found');
        res.json(user);
    } catch (err) {
        res.status(400).send('Error updating user: ' + err.message);
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).send('User not found');
        res.send('User deleted');
    } catch (err) {
        res.status(500).send('Error deleting user: ' + err.message);
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});