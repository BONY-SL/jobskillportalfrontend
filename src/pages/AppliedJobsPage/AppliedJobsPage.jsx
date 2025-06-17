import React, { useEffect, useState } from 'react';
import axios from 'axios';
import instance from "../../service/AxiosOrder";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box
} from '@mui/material';
import { Visibility, Delete } from '@mui/icons-material';
import { useAuth } from "../../context/AuthContext";
import NavBar from "../../component/NavBar/Navbar"

function AppliedJobsPage() {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [selectedJob, setSelectedJob] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [jobTitles, setJobTitles] = useState({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteJobId, setDeleteJobId] = useState(null);

  useEffect(() => {
    fetchAppliedJobs();
  }, [user.id]);

  const fetchAppliedJobs = async () => {
    try {
      const response = await instance.get(`/applications/user/${user.id}`);
      setAppliedJobs(response.data.data);

      // Fetch job titles for each job
      const jobTitlePromises = response.data.data.map(async (job) => {
        const jobResponse = await instance .get(`/jobs/${job.jobId}`);
        return { jobId: job.jobId, title: jobResponse.data.data.title };
      });

      const jobTitleResults = await Promise.all(jobTitlePromises);
      const titleMap = jobTitleResults.reduce((acc, job) => {
        acc[job.jobId] = job.title;
        return acc;
      }, {});

      setJobTitles(titleMap);
    } catch (error) {
      console.error('Error fetching applied jobs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewJob = async (jobId) => {
    try {
      const response = await instance.get(`/jobs/${jobId}`);
      setSelectedJob(response.data.data);
      setOpenModal(true);
    } catch (error) {
      console.error('Error fetching job details', error);
    }
  };

  const handleDeleteConfirm = (applicationId) => {
    setDeleteJobId(applicationId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteJob = async () => {
    try {
      await instance.delete(`/applications/${deleteJobId}`);
      setAppliedJobs(appliedJobs.filter(job => job.applicationId !== deleteJobId));
    } catch (error) {
      console.error('Error deleting job application', error);
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  return (
    <Box>
<NavBar />
 
    <Container maxWidth="lg" sx={{ mt: 4 }}>
    
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Applied Jobs
        </Typography>

        {loading ? (
          <Typography variant="h6" color="textSecondary">
            Loading applied jobs...
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Job Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Applied Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appliedJobs.map((job) => (
                  <TableRow key={job.applicationId}>
                    <TableCell>{jobTitles[job.jobId] || 'Loading...'}</TableCell>
                    <TableCell>{job.applicationStatus}</TableCell>
                    <TableCell>{new Date(job.appliedDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleViewJob(job.jobId)}>
                        <Visibility />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteConfirm(job.applicationId)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Job Details Dialog */}
      {selectedJob && (
        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>{selectedJob.title}</DialogTitle>
          <DialogContent>
            <Typography><strong>Company:</strong> {selectedJob.company}</Typography>
            <Typography><strong>Location:</strong> {selectedJob.location}</Typography>
            <Typography><strong>Description:</strong> {selectedJob.description}</Typography>
            <Typography><strong>Industry:</strong> {selectedJob.industry}</Typography>
            <Typography><strong>Salary:</strong> {selectedJob.salary}</Typography>
            <Typography><strong>Skills Required:</strong> {selectedJob.skillsRequired}</Typography>
            <Typography><strong>Experience Required:</strong> {selectedJob.experienceRequired}</Typography>
            <Typography><strong>Publish Date:</strong> {new Date(selectedJob.publishDate).toLocaleDateString()}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this application?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteJob} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
    </Box>
    
  );
}

export default AppliedJobsPage;
