import { Router } from 'express';
import { 
  submitLoanApplication,         
  fetchAllLoanApplications,       
  fetchUserLoanApplications,      
  modifyLoanStatus                
} from '../controllers/loan';
import { authMiddleWare } from '../middleware/auth'; 

const router = Router();

// POST a new loan-application
router.post('/apply', authMiddleWare, submitLoanApplication);

// GET all loan applications
router.get('/all', authMiddleWare, fetchAllLoanApplications);

// GET loan applications by status
router.get('/status', authMiddleWare, fetchUserLoanApplications);

// PATCH update loan application status (admin only)
router.patch('/update-status/:id', authMiddleWare, modifyLoanStatus);

export default router;
