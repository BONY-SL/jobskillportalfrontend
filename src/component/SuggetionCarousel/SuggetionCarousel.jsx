import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobSuggestions } from '../../store/jobsSlice';
import { useAuth } from '../../context/AuthContext';
import { Box, IconButton, CircularProgress, Typography } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Navigation, Autoplay } from 'swiper/modules';
import JobCard from '../JobCard/JobCard';

const SuggetionCarousel = () => {
  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const { resume } = useAuth();
  const dispatch = useDispatch();
  const { suggestedJobs, loading, error } = useSelector((state) => state.jobs);

  useEffect(() => {
    if (resume) {
      dispatch(fetchJobSuggestions(resume));
    }
  }, [resume, dispatch]);

  return (
    <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>
        {loading
          ? 'Loading job suggestions...'
          : `Found ${suggestedJobs.length} job suggestions`}
      </Typography>

      <Box
        sx={{
          maxWidth: '1000px',
          mx: 'auto',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 5, color: 'red' }}>
            Error: {error}
          </Box>
        ) : suggestedJobs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5, color: 'gray' }}>
            No job suggestions found.
          </Box>
        ) : (
          <Swiper
            ref={swiperRef}
            spaceBetween={100}
            slidesPerView={Math.min(3, suggestedJobs.length)}
            loop={suggestedJobs.length > 3}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            modules={[Navigation, Autoplay]}
            onSwiper={(swiper) => {
              setTimeout(() => {
                if (prevRef.current && nextRef.current) {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                  swiper.navigation.init();
                  swiper.navigation.update();
                }
              }, 100);
            }}
          >
            {suggestedJobs.map((job) => (
              <SwiperSlide key={job.id}>
                <JobCard job={job} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {suggestedJobs.length > 0 && (
          <>
            <IconButton
              ref={prevRef}
              sx={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                backgroundColor: 'white',
              }}
            >
              <ArrowBack />
            </IconButton>
            <IconButton
              ref={nextRef}
              sx={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                backgroundColor: 'white',
              }}
            >
              <ArrowForward />
            </IconButton>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SuggetionCarousel;