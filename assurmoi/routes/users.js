const express = require('express');
const router = express.Router();
const { validateUsername } = require('../middleware/users');
const { 
    getAllUsers, 
    getUser, 
    createUser, 
    deleteUser, 
    updateUser 
} = require('../services/users');

router.post('/', validateUsername, createUser);

router.get('/:id', getUser);

router.get('/', getAllUsers);

router.delete('/:id', deleteUser);

router.put('/:id', updateUser);

module.exports = router;