import { Request, Response } from 'express';
import UserModel from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register a new user
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role, adminKey, verifierKey } = req.body;
  console.log(req.body)

  // Verify role with the appropriate key
  if (role === 'admin' && adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ message: 'Invalid admin key' });
  }

  if (role === 'verifier' && verifierKey !== process.env.VERIFIER_KEY) {
    return res.status(403).json({ message: 'Invalid verifier key' });
  }

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    // Include role in the JWT payload
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login an existing user
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: existingUser._id, role: existingUser.role }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    res.json({ user: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
