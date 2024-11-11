import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Activity,
  CreditCard,
  DollarSign,
  Users,
  FileText,
  Home,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLoans() {
      try {
        const response = await fetch("http://localhost:5000/api/loans/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        console.log(data);
        setLoans(data);
      } catch (error) {
        console.error("Error fetching loans:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLoans();
  }, []);

  const handleUpdateStatus = async (loanId, newStatus) => {
    if (newStatus === "verified") {
      return alert("You are not authorized to verify loans.");
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/loans/update-status/${loanId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const updatedLoan = await response.json();
      setLoans(
        loans?.map((loan) =>
          loan._id === loanId
            ? { ...loan, status: updatedLoan?.updatedLoanApplication?.status }
            : loan
        )
      );
    } catch (error) {
      console.error("Error updating loan status:", error);
    }
  };

  const handlelabelClick = (label) => {
    if (label === "See all Users") {
      window.location.href = "/admin/users";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Navbar */}
      <nav className="w-full bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Activity className="h-6 w-6" />
          <span className="font-semibold text-xl">CREDIT APP</span>
        </div>
        <div className="flex gap-6">
          {[
            { icon: Home, label: "Dashboard" },
            { icon: FileText, label: "Reports" },
            { icon: Settings, label: "Settings" },
          ].map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-2 px-3 py-2 text-lg hover:bg-blue-700 rounded transition-all"
              onClick={() => handlelabelClick(item.label)}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </div>
        <Button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
        >
          Log Out
        </Button>
      </nav>

      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-medium text-muted-foreground">TOTAL LOANS</CardTitle>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{loans?.length || "0"}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Applied Loans</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <span className="text-lg font-semibold text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <Table className="table-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left text-sm font-medium">Name</TableHead>
                    <TableHead className="text-left text-sm font-medium">Loan Type</TableHead>
                    <TableHead className="text-left text-sm font-medium">Date</TableHead>
                    <TableHead className="text-left text-sm font-medium">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans?.map((loan) => (
                    <TableRow key={loan?._id} className="border-b hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={loan?.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{loan?.fullName[0]}</AvatarFallback>
                          </Avatar>
                          {loan?.fullName}
                        </div>
                      </TableCell>
                      <TableCell>{loan?.loanReason}</TableCell>
                      <TableCell>{new Date(loan?.applicationDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <select
                          value={loan?.status}
                          onChange={(e) => handleUpdateStatus(loan?._id, e.target.value)}
                          className="border rounded px-3 py-2 text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                          <option value="verified">Verified</option>
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
