import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BellIcon, CreditCard, Home, MessageCircle, User, Wallet } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function ApplicationForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    loanAmount: '',
    loanTenure: '',
    employmentStatus: '',
    loanReason: '',
    employmentAddress1: '',
    termsAccepted: false,
    consent: false,
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.loanAmount || formData.loanAmount <= 0) newErrors.loanAmount = 'Please enter a valid loan amount';
    if (!formData.loanTenure || formData.loanTenure <= 0) newErrors.loanTenure = 'Please enter a valid loan tenure';
    if (!formData.employmentStatus.trim()) newErrors.employmentStatus = 'Employment status is required';
    if (!formData.loanReason.trim()) newErrors.loanReason = 'Reason for loan is required';
    if (!formData.employmentAddress1.trim()) newErrors.employmentAddress1 = 'Employment address is required';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms';
    if (!formData.consent) newErrors.consent = 'You must provide consent';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: undefined }));
  };

  const handleCheckboxChange = (id) => {
    setFormData(prev => ({ ...prev, [id]: !prev[id] }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await fetch('https://asdfkjakdsfw.xyz/api/loans/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Application submission failed');
      setFormData({
        fullName: '',
        loanAmount: '',
        loanTenure: '',
        employmentStatus: '',
        loanReason: '',
        employmentAddress1: '',
        termsAccepted: false,
        consent: false,
      });
      navigate('/loans');
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-blue-600 font-bold text-lg">CREDIT APP</span>
              
            </div>
            <div className="flex items-center space-x-4">
            
              <Button onClick={handleLogout} size="icon" variant = "ghost">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center">APPLY FOR A LOAN</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { id: 'fullName', label: 'Full name as it appears on bank account', type: 'text', placeholder: 'Enter your full name as it appears on bank account' },
                  { id: 'loanAmount', label: 'How much do you need?', type: 'number', placeholder: 'Enter amount you need' },
                  { id: 'loanTenure', label: 'Loan tenure (in months)', type: 'number', placeholder: 'Loan tenure (in months)' },
                  { id: 'employmentStatus', label: 'Employment status', type: 'text', placeholder: 'Employment status' },
                ].map(({ id, label, type, placeholder }) => (
                  <div key={id} className="space-y-2">
                    <Label htmlFor={id}>{label}</Label>
                    <Input
                      id={id}
                      value={formData[id]}
                      onChange={handleInputChange}
                      placeholder={placeholder}
                      type={type}
                      className={errors[id] ? "border-red-500" : ""}
                    />
                    {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
                  </div>
                ))}
                {[
                  { id: 'loanReason', label: 'Reason for loan', placeholder: 'Reason for loan' },
                  { id: 'employmentAddress1', label: 'Employment address', placeholder: 'Employment address' },
                ].map(({ id, label, placeholder }) => (
                  <div key={id} className="space-y-2">
                    <Label htmlFor={id}>{label}</Label>
                    <Textarea
                      id={id}
                      value={formData[id]}
                      onChange={handleInputChange}
                      placeholder={placeholder}
                      className={`min-h-[100px] ${errors[id] ? "border-red-500" : ""}`}
                    />
                    {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {[
                  { id: 'termsAccepted', label: 'I have read the important information and accept that by completing the application I will be bound by the terms' },
                  { id: 'consent', label: 'Any personal and credit information obtained may be disclosed from time to time to other lenders, credit bureau, or other credit reporting agencies' },
                ].map(({ id, label }) => (
                  <div key={id} className="flex items-center space-x-2">
                    <Checkbox id={id} checked={formData[id]} onCheckedChange={() => handleCheckboxChange(id)} />
                    <Label htmlFor={id} className={`text-sm ${errors[id] ? "text-red-500" : ""}`}>{label}</Label>
                  </div>
                ))}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
