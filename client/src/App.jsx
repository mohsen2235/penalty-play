import React from 'react';
import { useLocation } from 'react-router-dom';
import ProfilePage from './components/ProfilePage';
import Game3D from './components/3D/Game3D'; // پنالتی
import Chess3D from './components/3D/Chess3D'; // شطرنج
import ChatBox from './components/UI/ChatBox';
import NotificationsBox from './components/UI/NotificationsBox';
import CinematicButton from './components/UI/CinematicButton';
import ReplayButton from './components/UI/ReplayButton';
import TransactionHistory from './components/TransactionHistory';
import Wallet from './components/Wallet';
import Achievements from './components/Achievements';
import Leaderboard from './components/Leaderboard';
import StatsChart from './components/StatsChart';

export default function App() {
  // آماده‌سازی وب‌اپ تلگرام
  const tg = window.Telegram?.WebApp;
  if (tg) { tg.ready(); tg.expand(); }

  // انتخاب بازی بر اساس پارامتر URL
  const { search } = useLocation();
  const urlParams = new URLSearchParams(search);
  const game = urlParams.get('game') || 'penalty'; // پیش‌فرض پنالتی

  const GameComponent = game === 'chess' ? Chess3D : Game3D;

  return (
    <div className="app-container dark:bg-gray-800 min-h-screen">
      {/* پروفایل و کیف پول */}
      <div className="sidebar p-4 space-y-4">
        <ProfilePage />
        <Wallet />
        <TransactionHistory />
        <Achievements />
      </div>

      {/* بخش بازی و ابزارها */}
      <div className="game-area relative">
        <GameComponent /> {/* رندر پنالتی یا شطرنج بر اساس game */}
        <div className="hud top-4 left-4 flex space-x-2">
          <CinematicButton onClick={() => {/* زاویه دوربین */}} />
          <ReplayButton onClick={() => {/* بازپخش */}} />
        </div>
        <ChatBox />
        <NotificationsBox />
      </div>

      {/* آمار و تابلوی امتیازات */}
      <div className="analytics p-4 grid grid-cols-2 gap-4">
        <Leaderboard />
        <StatsChart />
      </div>
    </div>
  );
}

import './styles/tailwind.css';