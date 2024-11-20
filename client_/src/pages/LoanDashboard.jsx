import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BellIcon,
  Home,
  MessageCircle,
  User,
  Wallet,
  CreditCard,
  Search,
  Filter,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LoanDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [balance, setBalance] = useState(0);
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('borrow');

  useEffect(() => {
    const fetchLoans = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://asdfkjakdsfw.xyz/api/loans/status`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (!response.ok) throw new Error('Failed to fetch loans');

        const data = await response.json();
        setLoans(data);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching loans:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoans();
  }, [currentPage, sortField, sortOrder, statusFilter, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 text-white">
            <div className="flex items-center">
              <span className="font-bold text-lg">CREDIT APP</span>
             
            </div>
            <div className="flex items-center space-x-4">
            <Button 
                onClick={() => navigate('/application')}
                className=" text-white"
                variant='ghost'
              >
                Get A Loan
              </Button>
              <Button onClick={handleLogout} variant='ghost' size="icon" className="text-white">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-8 px-4">
        <div className="space-y-6">

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Borrower Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date Applied</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : loans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      No loans found
                    </TableCell>
                  </TableRow>
                ) : (
                  loans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={loan.officerImage || "/placeholder.svg"} />
                            <AvatarFallback>{loan.fullName || "JD"}</AvatarFallback>
                          </Avatar>
                          <span>{loan.fullName || "John Doe"}</span>
                        </div>
                      </TableCell>
                      <TableCell>{loan.loanAmount}</TableCell>
                      <TableCell>{new Date(loan.applicationDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button className={`text-white ${loan.status === 'Active' ? 'bg-yellow-500' : loan.status === 'Approved' ? 'bg-green-600' : loan.status === 'Pending' ? 'bg-red-600' : 'bg-blue-600'}`}>
                          {loan.status}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handlePreviousPage} disabled={currentPage === 1 || isLoading}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages || isLoading}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
