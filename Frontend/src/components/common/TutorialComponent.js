import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  LinearProgress,
  Typography,
  styled,
  alpha
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as CircleIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  width: 800,
  height: 800,
  maxWidth: '90vw',
  maxHeight: '90vh',
  overflow: 'auto',
  boxShadow: theme.shadows[3],
  zIndex: 9999,
  borderRadius: '12px',
}));

const SidebarButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(3),
  marginTop: theme.spacing(0.5),
  padding: theme.spacing(1, 2),
  width: 'calc(100% - 16px)',
  justifyContent: 'flex-start',
  textAlign: 'left',
  textTransform: 'none',
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('all'),
  '&.active': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    fontWeight: 500
  },
  '&:not(.active)': {
    color: theme.palette.text.secondary,
    '&:hover': {
      backgroundColor: alpha(theme.palette.grey[500], 0.1),
    }
  },
}));

const Backdrop = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9998,
});

const tabsData = {
  "tab1": {
    label: "Fundamentals",
    title: "Getting Started",
    subtitle: "Learn the basic concepts and foundation",
    image: "/api/placeholder/800/400",
    sections: [
      {
        id: "section1_1",
        title: "Core Concepts",
        content: "Content for section 1.1 - This is the first subsection of fundamentals.",
        image: "/api/placeholder/800/400"
      },
      {
        id: "section1_2",
        title: "Key Components",
        content: "Content for section 1.2 - This is the second subsection of fundamentals.",
        image: "/api/placeholder/800/400"
      },
      {
        id: "section1_3",
        title: "Best Practices",
        content: "Content for section 1.3 - This is the third subsection of fundamentals.",
        image: "/api/placeholder/800/400"
      }
    ]
  },
  "tab2": {
    label: "Advanced",
    title: "Advanced Techniques",
    subtitle: "Explore advanced concepts and methods",
    image: "/api/placeholder/800/400",
    sections: [
      {
        id: "section2_1",
        title: "Advanced Patterns",
        content: "Content for section 2.1 - This is the first subsection of advanced techniques.",
        image: "/api/placeholder/800/400"
      },
      {
        id: "section2_2",
        title: "Performance Tips",
        content: "Content for section 2.2 - This is the second subsection of advanced techniques.",
        image: "/api/placeholder/800/400"
      },
      {
        id: "section2_3",
        title: "Optimization",
        content: "Content for section 2.3 - This is the third subsection of advanced techniques.",
        image: "/api/placeholder/800/400"
      }
    ]
  },
  "tab3": {
    label: "Mastery",
    title: "Mastering the Craft",
    subtitle: "Perfect your skills with expert knowledge",
    image: "/api/placeholder/800/400",
    sections: [
      {
        id: "section3_1",
        title: "Expert Techniques",
        content: "Content for section 3.1 - This is the first subsection of mastery.",
        image: "/api/placeholder/800/400"
      },
      {
        id: "section3_2",
        title: "Real-world Cases",
        content: "Content for section 3.2 - This is the second subsection of mastery.",
        image: "/api/placeholder/800/400"
      },
      {
        id: "section3_3",
        title: "Final Review",
        content: "Content for section 3.3 - This is the third subsection of mastery.",
        image: "/api/placeholder/800/400"
      }
    ]
  }
};

const TutorialComponent = ({ 
  tutorialData = tabsData,
  isVisible,
  onClose,
  initialTab = "tab1",
  initialSection = 0,
  onComplete,
  conceptName = "Machine Learning",
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeSectionIndex, setActiveSectionIndex] = useState(initialSection);
  const [completedSections, setCompletedSections] = useState(new Set());
  const [isFullyCompleted, setIsFullyCompleted] = useState(false);

  const calculateProgress = () => {
    const totalSections = Object.values(tutorialData).reduce((acc, tab) => acc + tab.sections.length, 0);
    return (completedSections.size / totalSections) * 100;
  };

  const isSectionCompleted = (tabKey, sectionIndex) => {
    return completedSections.has(`${tabKey}-${sectionIndex}`);
  };

  const markCurrentSectionComplete = () => {
    setCompletedSections(prev => {
      const newSet = new Set(prev);
      newSet.add(`${activeTab}-${activeSectionIndex}`);
      return newSet;
    });
  };

  const handleNext = () => {
    markCurrentSectionComplete();
    const currentTabSections = tutorialData[activeTab].sections;
    if (activeSectionIndex < currentTabSections.length - 1) {
      setActiveSectionIndex(activeSectionIndex + 1);
    } else {
      const tabKeys = Object.keys(tutorialData);
      const currentTabIndex = tabKeys.indexOf(activeTab);
      if (currentTabIndex < tabKeys.length - 1) {
        setActiveTab(tabKeys[currentTabIndex + 1]);
        setActiveSectionIndex(0);
      }
    }
  };

  const handleBack = () => {
    if (activeSectionIndex > 0) {
      setActiveSectionIndex(activeSectionIndex - 1);
    } else {
      const tabKeys = Object.keys(tutorialData);
      const currentTabIndex = tabKeys.indexOf(activeTab);
      if (currentTabIndex > 0) {
        setActiveTab(tabKeys[currentTabIndex - 1]);
        setActiveSectionIndex(tutorialData[tabKeys[currentTabIndex - 1]].sections.length - 1);
      }
    }
  };

  const handleComplete = () => {
    setCompletedSections(prev => {
      const newSet = new Set(prev);
      newSet.add(`${activeTab}-${activeSectionIndex}`);
      return newSet;
    });
    setIsFullyCompleted(true);
    
    if (onComplete) {
      onComplete(completedSections);
    }
    onClose();
  };

  const isLastSection = activeSectionIndex === tutorialData[activeTab].sections.length - 1;
  const isLastTab = activeTab === Object.keys(tutorialData)[Object.keys(tutorialData).length - 1];

  if (!isVisible) return null;

  return (
    <Backdrop>
      <StyledCard>
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}>
          <Box sx={{ p: 6, pb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start' 
            }}>
              <Box sx={{ mb: 1 }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 0.5,
                    fontSize: '1.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {tutorialData[activeTab].title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {tutorialData[activeTab].subtitle}
                </Typography>
              </Box>
              <IconButton 
                onClick={onClose}
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary' }
                }}
              >
                <CloseIcon sx={{ width: 16, height: 16 }} />
              </IconButton>
            </Box>
            <Box sx={{ mt: 1, width: '100%' }}>
              <LinearProgress 
                variant="determinate" 
                value={calculateProgress()} 
                sx={{
                  height: 7,
                  width: '100%',
                  bgcolor: 'grey.200',
                  borderRadius: 1,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'primary.main',
                    borderRadius: 1
                  }
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex' }}>
          <Box sx={{ 
            width: 280,
            borderRight: 1,
            borderColor: 'divider',
            p: 1
          }}>
            {Object.entries(tutorialData).map(([key, data]) => (
              <Box key={key} sx={{ mb: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  px: 2,
                  py: 1,
                  '& .MuiTypography-root': {
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'text.primary',
                    fontFamily: 'Inter, sans-serif'
                  }
                }}>
                  {data.sections.every((_, index) => isSectionCompleted(key, index)) ? (
                    <CheckCircleIcon sx={{ 
                      width: 16, 
                      height: 16, 
                      color: 'success.main',
                      mr: 2
                    }} />
                  ) : key === activeTab ? (
                    <CircleIcon sx={{ 
                      width: 16, 
                      height: 16, 
                      color: 'primary.main',
                      mr: 2
                    }} />
                  ) : (
                    <CircleIcon sx={{ 
                      width: 16, 
                      height: 16, 
                      color: 'text.disabled',
                      mr: 2
                    }} />
                  )}
                  <Typography>{data.label}</Typography>
                </Box>
                {data.sections.map((section, index) => (
                  <SidebarButton
                    key={section.id}
                    onClick={() => {
                      setActiveTab(key);
                      setActiveSectionIndex(index);
                    }}
                    className={key === activeTab && index === activeSectionIndex ? 'active' : ''}
                    sx={{
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {isSectionCompleted(key, index) ? (
                      <CheckCircleIcon sx={{ 
                        width: 12, 
                        height: 12,
                        color: 'success.main',
                        mr: 2,
                        flexShrink: 0
                      }} />
                    ) : (
                      <CircleIcon sx={{ 
                        width: 12, 
                        height: 12,
                        color: 'text.disabled',
                        mr: 2,
                        flexShrink: 0
                      }} />
                    )}
                    <Typography 
                      variant="body2" 
                      component="span"
                      sx={{ 
                        color: 'inherit',
                        fontWeight: 'inherit'
                      }}
                    >
                      {section.title}
                    </Typography>
                  </SidebarButton>
                ))}
              </Box>
            ))}
          </Box>

          <Box sx={{ 
            flex: 1,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            height: '650px',
            position: 'relative'
          }}>
            <Typography 
              variant="h6"
              sx={{ 
                mb: 1,
                fontWeight: 600,
                color: 'text.primary',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              {tutorialData[activeTab].sections[activeSectionIndex].title}
            </Typography>
            
            <Box
              component="img"
              src={tutorialData[activeTab].sections[activeSectionIndex].image}
              alt={`${tutorialData[activeTab].sections[activeSectionIndex].title} illustration`}
              sx={{
                width: '100%',
                maxHeight: '250px',
                objectFit: 'contain',
                borderRadius: 1,
                mb: 3,
                bgcolor: 'grey.100'
              }}
            />

            <Typography 
              variant="body1"
              sx={{ 
                color: 'text.primary',
                lineHeight: 1.7,
                flex: 1,
                overflow: 'auto',
                fontFamily: 'Inter, sans-serif',
                fontSize: '1rem',
                fontWeight: 400,
                letterSpacing: '0.00938em'
              }}
            >
              {tutorialData[activeTab].sections[activeSectionIndex].content}
            </Typography>

            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              mt: 'auto',
              position: 'relative'
            }}>
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pt: 2,
                pb: 1,
                px: 3,
                borderTop: 1,
                borderColor: 'divider'
              }}>
                <Button
                  variant="text"
                  onClick={handleBack}
                  disabled={activeTab === "tab1" && activeSectionIndex === 0}
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': { color: 'text.primary' },
                    ml: -1
                  }}
                >
                  Previous
                </Button>
                <Typography 
                  variant="body2"
                  sx={{ color: 'text.secondary' }}
                >
                  {activeSectionIndex + 1} of {tutorialData[activeTab].sections.length}
                </Typography>
                <Button
                  variant="contained"
                  onClick={isLastTab && isLastSection ? handleComplete : handleNext}
                  sx={{ 
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark'
                    },
                    mr: -1
                  }}
                >
                  {isLastSection
                    ? (isLastTab ? "Complete" : "Next Chapter")
                    : "Continue"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </StyledCard>
    </Backdrop>
  );
};

export const defaultTutorialData = tabsData;
export default TutorialComponent;