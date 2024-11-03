const User = require('../models/User'); 
// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching user data' });
    }
};


// Update a user
exports.updateUser = async (req, res) => {
    try {
        const { password, ...updateData } = req.body;

        // Update other fields directly
        let user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

        // If password is provided, update it directly (without hashing)
        if (password) {
            user.password = password;
            await user.save();
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Sign-in controller
exports.signInUser = async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      if (user.password !== password) {
        return res.status(401).json({ error: 'Invalid password' });
      }
  
      // Return user details including user ID
      res.status(200).json({
        message: 'Sign-in successful',
        user: {
          _id: user._id,
          username: user.username,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
