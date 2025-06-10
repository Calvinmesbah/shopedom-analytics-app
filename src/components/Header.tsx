'use client';

import Logo from './Logo';
import { useState } from 'react';
import { useAnalyticsEvents } from './providers/AnalyticsEventsProvider';
import { Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useMediaQuery } from '@mui/material';

function Header() {
  const [selectedService, setSelectedService] = useState('24H');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { updateDateRange } = useAnalyticsEvents();
  
  // Detect screen size - hide radio group on screens smaller than 768px (md breakpoint)
  const isMobile = useMediaQuery('(max-width: 768px)');
  const open = Boolean(anchorEl);

  const services = [
    { id: '90J', label: '90J', type: 'text' },
    { id: '30J', label: '30J', type: 'text' },
    { id: '7J', label: '7J', type: 'text' },
    { id: '24H', label: '24H', type: 'text' },
  ];

  const dateRangeMap: Record<string, string> = {
    '90J': '90daysAgo',
    '30J': '30daysAgo',
    '7J': '7daysAgo',
    '24H': '24hours',
  };

  const handleServiceClick = (id: string) => {
    setSelectedService(id);
    updateDateRange(dateRangeMap[id]);
    if (isMobile) {
      setAnchorEl(null); // Close menu on mobile after selection
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const RadioGroupDesktop = () => (
    <div
      className="flex items-center space-x-3"
      role="radiogroup"
      aria-label="Service options"
    >
      {services.map((service) => (
        <button
          key={service.id}
          role="radio"
          aria-checked={selectedService === service.id}
          onClick={() => handleServiceClick(service.id)}
          className={`
            backdrop-blur-sm font-bold border rounded-lg w-10 aspect-square text-sm transition-all duration-200 cursor-pointer
            ${
              selectedService === service.id
                ? 'bg-white text-blue-900 border-white shadow-lg'
                : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
            }
          `}
        >
          {service.label}
        </button>
      ))}
    </div>
  );

  const RadioGroupMobile = () => (
    <>
      <IconButton
        aria-label="more options"
        aria-controls={open ? 'period-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleMenuClick}
        sx={{ 
          color: 'white',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          }
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="period-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        MenuListProps={{
          'aria-labelledby': 'period-button',
        }}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            minWidth: '120px',
            marginTop: '4px',
          }
        }}
      >
        {services.map((service) => (
          <MenuItem
            key={service.id}
            onClick={() => handleServiceClick(service.id)}
            selected={selectedService === service.id}
            sx={{
              fontWeight: selectedService === service.id ? 'bold' : 'normal',
              backgroundColor: selectedService === service.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
              },
              '&.Mui-selected:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.3)',
              }
            }}
          >
            {service.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );

  return (
    <header>
      <nav className="bg-main-blue p-4 rounded-lg flex justify-between items-center">
        <Logo size={250} />
        {isMobile ? <RadioGroupMobile /> : <RadioGroupDesktop />}
      </nav>
    </header>
  );
}

export default Header;