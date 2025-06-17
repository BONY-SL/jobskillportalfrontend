import { Avatar, Box, Button, Card, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function JobCard({job}) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Passing the job object as state to the JobDetails page
    navigate('/jobdetails', { state: { job } });
  };

  return (
    <Box>
      <Card sx={{ width: '300px', height: '200px' , padding: '20px', borderRadius: '10px', margin: '10px' }}>
        <Typography variant="h4" color="initial">{job.title}</Typography>
        <Typography variant="h5" color="initial">{job.location}</Typography>
        <Typography variant="h5" color="initial">{job.salary}</Typography>
        <Button variant="contained" color="primary" onClick={handleClick}>
          View Details
        </Button>
      </Card>
    </Box>
  );
}

export default JobCard;
