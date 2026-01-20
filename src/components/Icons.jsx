import React from 'react';

// 3D-style icons with gradients and depth
export const Icons = {
  // Home icon with 3D effect
  Home: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="homeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#886AFF" />
          <stop offset="100%" stopColor="#6D4AFF" />
        </linearGradient>
        <filter id="homeShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#886AFF" floodOpacity="0.3"/>
        </filter>
      </defs>
      <path 
        d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" 
        stroke="url(#homeGradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        filter="url(#homeShadow)"
      />
    </svg>
  ),

  // Market/Chart icon
  Chart: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D68F" />
          <stop offset="100%" stopColor="#00FFB2" />
        </linearGradient>
        <filter id="chartShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00D68F" floodOpacity="0.3"/>
        </filter>
      </defs>
      <path 
        d="M3 3V21H21" 
        stroke="url(#chartGradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        filter="url(#chartShadow)"
      />
      <path 
        d="M7 14L11 10L15 14L21 8" 
        stroke="url(#chartGradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        filter="url(#chartShadow)"
      />
    </svg>
  ),

  // News icon
  News: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="newsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
        <filter id="newsShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3B82F6" floodOpacity="0.3"/>
        </filter>
      </defs>
      <path 
        d="M19 20H5C3.89543 20 3 19.1046 3 18V6C3 4.89543 3.89543 4 5 4H15C16.1046 4 17 4.89543 17 6V7M19 20C17.8954 20 17 19.1046 17 18V7M19 20C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7H17M7 8H13M7 12H13M7 16H10" 
        stroke="url(#newsGradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        filter="url(#newsShadow)"
      />
    </svg>
  ),

  // Portfolio/Wallet icon
  Wallet: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="walletGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
        <filter id="walletShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#F59E0B" floodOpacity="0.3"/>
        </filter>
      </defs>
      <path 
        d="M21 12V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V16" 
        stroke="url(#walletGradient)" 
        strokeWidth="2" 
        strokeLinecap="round"
        filter="url(#walletShadow)"
      />
      <path 
        d="M18 12C18 10.8954 18.8954 10 20 10H21V14H20C18.8954 14 18 13.1046 18 12Z" 
        stroke="url(#walletGradient)" 
        strokeWidth="2"
        filter="url(#walletShadow)"
      />
    </svg>
  ),

  // User icon
  User: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="userGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#886AFF" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
        <filter id="userShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#886AFF" floodOpacity="0.3"/>
        </filter>
      </defs>
      <circle cx="12" cy="8" r="4" stroke="url(#userGradient)" strokeWidth="2" filter="url(#userShadow)"/>
      <path 
        d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" 
        stroke="url(#userGradient)" 
        strokeWidth="2" 
        strokeLinecap="round"
        filter="url(#userShadow)"
      />
    </svg>
  ),

  // Login icon
  Login: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="loginGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D68F" />
          <stop offset="100%" stopColor="#00FFB2" />
        </linearGradient>
      </defs>
      <path 
        d="M15 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" 
        stroke="url(#loginGradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  ),

  // Logout icon
  Logout: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#FF8F8F" />
        </linearGradient>
      </defs>
      <path 
        d="M9 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" 
        stroke="url(#logoutGradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  ),

  // Trending Up icon
  TrendingUp: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="trendUpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D68F" />
          <stop offset="100%" stopColor="#00FFB2" />
        </linearGradient>
      </defs>
      <path 
        d="M23 6L13.5 15.5L8.5 10.5L1 18M23 6H17M23 6V12" 
        stroke="url(#trendUpGradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  ),

  // Trending Down icon
  TrendingDown: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="trendDownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#FF8F8F" />
        </linearGradient>
      </defs>
      <path 
        d="M23 18L13.5 8.5L8.5 13.5L1 6M23 18H17M23 18V12" 
        stroke="url(#trendDownGradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  ),

  // Bitcoin icon
  Bitcoin: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="btcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F7931A" />
          <stop offset="100%" stopColor="#FFAB40" />
        </linearGradient>
        <filter id="btcGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#F7931A" floodOpacity="0.5"/>
        </filter>
      </defs>
      <circle cx="12" cy="12" r="10" stroke="url(#btcGradient)" strokeWidth="2" filter="url(#btcGlow)"/>
      <path 
        d="M9.5 7H13C14.3807 7 15.5 8.11929 15.5 9.5C15.5 10.8807 14.3807 12 13 12H9.5V7ZM9.5 12H14C15.3807 12 16.5 13.1193 16.5 14.5C16.5 15.8807 15.3807 17 14 17H9.5V12ZM10 5V7M10 17V19M13 5V7M13 17V19" 
        stroke="url(#btcGradient)" 
        strokeWidth="1.5" 
        strokeLinecap="round"
        filter="url(#btcGlow)"
      />
    </svg>
  ),

  // Ethereum icon
  Ethereum: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ethGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#627EEA" />
          <stop offset="100%" stopColor="#8C9EFF" />
        </linearGradient>
        <filter id="ethGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#627EEA" floodOpacity="0.5"/>
        </filter>
      </defs>
      <path 
        d="M12 2L4 12L12 16L20 12L12 2Z" 
        stroke="url(#ethGradient)" 
        strokeWidth="1.5" 
        strokeLinejoin="round"
        filter="url(#ethGlow)"
      />
      <path 
        d="M4 12L12 22L20 12L12 16L4 12Z" 
        stroke="url(#ethGradient)" 
        strokeWidth="1.5" 
        strokeLinejoin="round"
        filter="url(#ethGlow)"
      />
    </svg>
  ),

  // Menu icon
  Menu: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M4 6H20M4 12H20M4 18H20" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  ),

  // Close icon
  Close: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M18 6L6 18M6 6L18 18" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  ),

  // Search icon
  Search: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="searchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#886AFF" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
      <circle cx="11" cy="11" r="7" stroke="url(#searchGradient)" strokeWidth="2"/>
      <path d="M21 21L16.5 16.5" stroke="url(#searchGradient)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),

  // Star icon
  Star: ({ className = "w-6 h-6", filled = false }) => (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? "url(#starGradient)" : "none"} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
      </defs>
      <path 
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
        stroke="url(#starGradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  ),

  // Arrow Right icon
  ArrowRight: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M5 12H19M19 12L12 5M19 12L12 19" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  ),

  // Plus icon
  Plus: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="plusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D68F" />
          <stop offset="100%" stopColor="#00FFB2" />
        </linearGradient>
      </defs>
      <path 
        d="M12 5V19M5 12H19" 
        stroke="url(#plusGradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  ),

  // Rocket icon for hero
  Rocket: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#886AFF" />
          <stop offset="100%" stopColor="#00D68F" />
        </linearGradient>
        <filter id="rocketGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#886AFF" floodOpacity="0.6"/>
        </filter>
      </defs>
      <path 
        d="M4.5 16.5C3 18 3.5 21 3.5 21C3.5 21 6.5 21.5 8 20C9 19.5 9 18 8 17C7 16 5.5 16 4.5 16.5ZM12 15L9 12L13 6C15 4 18 3 21 3C21 6 20 9 18 11L12 15ZM9 12L3 14L5 19L9 12Z" 
        stroke="url(#rocketGradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        filter="url(#rocketGlow)"
      />
      <circle cx="16.5" cy="7.5" r="1.5" fill="url(#rocketGradient)"/>
    </svg>
  ),

  // Shield icon for security
  Shield: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D68F" />
          <stop offset="100%" stopColor="#00FFB2" />
        </linearGradient>
        <filter id="shieldGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#00D68F" floodOpacity="0.5"/>
        </filter>
      </defs>
      <path 
        d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" 
        stroke="url(#shieldGradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        filter="url(#shieldGlow)"
      />
      <path 
        d="M9 12L11 14L15 10" 
        stroke="url(#shieldGradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  ),

  // Globe icon
  Globe: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="globeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
        <filter id="globeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#3B82F6" floodOpacity="0.5"/>
        </filter>
      </defs>
      <circle cx="12" cy="12" r="10" stroke="url(#globeGradient)" strokeWidth="2" filter="url(#globeGlow)"/>
      <path 
        d="M2 12H22M12 2C14.5 4.5 16 8 16 12C16 16 14.5 19.5 12 22M12 2C9.5 4.5 8 8 8 12C8 16 9.5 19.5 12 22" 
        stroke="url(#globeGradient)" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
    </svg>
  ),

  // Zap/Lightning icon
  Zap: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="zapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
        <filter id="zapGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#F59E0B" floodOpacity="0.6"/>
        </filter>
      </defs>
      <path 
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z" 
        stroke="url(#zapGradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="url(#zapGradient)"
        fillOpacity="0.2"
        filter="url(#zapGlow)"
      />
    </svg>
  ),
};

export default Icons;
