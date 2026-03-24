const getAllUsers = (req, res) => {
    res.status(200).json({ 
        user: []
    });
};

const getUser = (req, res) => {
    res.status(200).json({ 
        user: req.params.id
    });
};

const createUser = (req, res) => {
    const user = req.body;
    res.status(201).json({ 
        user
    });
};

const deleteUser = (req, res) => {
    res.status(200).json({ 
        message: `user ${req.params.id} deleted`
    });
};

const updateUser = (req, res) => {
    res.status(200).json({ 
        message: `user ${req.params.id} updated`,
        user: req.body
    });
};

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
};