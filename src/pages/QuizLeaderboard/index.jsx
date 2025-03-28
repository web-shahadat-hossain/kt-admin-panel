import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // ShadCN Dialog (Modal)

const QuizLeaderboard = () => {
  const { register, handleSubmit, reset } = useForm();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // Modal open state
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "https://back.knowledgetemple.in/api/v1/admin/quiz/quiz-leader-board",
          {
            headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
          }
        );
        setLeaderboard(response.data?.data?.docs || []);
        console.log(response.data);
      } catch (err) {
        toast.error(err.message || "Failed to fetch leaderboard");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const handleCertificateUpload = async (data) => {
    if (!selectedUser) return;

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("certificate", data.certificate[0]);

      const response = await axios.post(
        `http://localhost:9657/api/v1/admin/quiz/certificate/${selectedUser}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setLeaderboard((prev) =>
          prev.map((item) =>
            item._id === selectedUser
              ? { ...item, certificateUrl: response.data.data.certificateUrl }
              : item
          )
        );
        toast.success("Certificate uploaded successfully!");
        setModalOpen(false); // Close modal after upload
      }
    } catch (err) {
      toast.error(err.message || "Failed to upload certificate");
    } finally {
      setUploading(false);
      reset();
      setSelectedUser(null);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6 page-transition">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quiz Leaderboard</h1>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Quiz</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead>Certificate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No quiz results found
                </TableCell>
              </TableRow>
            ) : (
              leaderboard.map((result, index) => (
                <TableRow key={result._id || index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {result.userId?.name || "N/A"}
                  </TableCell>
                  <TableCell>{result.userId?.email || "N/A"}</TableCell>
                  <TableCell>{result.userId?.mobile || "N/A"}</TableCell>
                  <TableCell>
                    {result.quizId?.title || "Quiz not found"}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        index === 0
                          ? "text-yellow-500 font-bold"
                          : index === 1
                          ? "text-gray-500 font-bold"
                          : index === 2
                          ? "text-amber-700 font-bold"
                          : "font-bold"
                      }
                    >
                      {result.score || 0}
                    </span>{" "}
                    / {result.answers?.length || 0}
                  </TableCell>
                  <TableCell>
                    {result.certificate ? (
                      <img
                        src={result.certificate}
                        alt="Certificate"
                        className="w-16 h-16 rounded-md object-cover"
                      />
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(result._id);
                          setModalOpen(true);
                        }}
                      >
                        Issue Certificate
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Certificate Upload Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Certificate</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(handleCertificateUpload)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="certificate">Certificate File (JPG, PNG)</Label>
              <Input
                id="certificate"
                type="file"
                accept="image/png, image/jpeg"
                {...register("certificate", { required: true })}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={uploading}>
                {uploading ? "Uploading..." : "Upload Certificate"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setModalOpen(false)}
                disabled={uploading}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizLeaderboard;
