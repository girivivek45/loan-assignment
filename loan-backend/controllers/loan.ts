import { Request, Response } from 'express';
import LoanApplicationModel from '../models/loanModel';
import { IGetUser } from '../routes/role';

type UserRole = 'user' | 'admin' | 'verifier';

// Submit a new application

export const submitLoanApplication = async (req: IGetUser, res: Response) => {
  try {
    const applicantId = req.user;
    const loanDetails = { ...req.body, userId:applicantId };
    const loanApplication = new LoanApplicationModel(loanDetails);
    await loanApplication.save();

    res.status(201).json({ message: 'Loan application successfully submitted', loanApplication });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit loan application', error });
  }
};

// Retrieve all loan applications
export const fetchAllLoanApplications = async (req: IGetUser, res: Response) => {
  try {
    const loanApplications = await LoanApplicationModel.find();
    res.status(200).json(loanApplications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve loan applications', error });
  }
};

// Retrieve loan applications by user ID
export const fetchUserLoanApplications:any = async (req: IGetUser, res: Response) => {
  const applicantId = req.user;

  try {
    const userLoanApplications = await LoanApplicationModel.find({ userId:applicantId });
    res.status(200).json(userLoanApplications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve loan applications by user ID', error });
  }
};

// Update the status of a loan application (admin or verifier only)
export const modifyLoanStatus = async (req: IGetUser, res: Response) => {
  const { id: loanId } = req.params;
  const { status: newStatus } = req.body;

  if (req.role === 'user') {
    return res.status(403).json({ message: 'Access denied: only admin or verifier can modify loan status' });
  }

  try {
    const updatedLoanApplication = await LoanApplicationModel.findByIdAndUpdate(
      loanId,
      { status: newStatus },
      { new: true }
    );

    if (!updatedLoanApplication) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    res.status(200).json({ message: 'Loan status successfully updated', updatedLoanApplication });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update loan status', error });
  }
};
