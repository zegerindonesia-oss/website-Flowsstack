'use client';

import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Video
} from 'lucide-react';

// Define types
type EventStatus = 'pending' | 'published' | 'failed';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  status: EventStatus;
  platform: string;
}

// Mock Data
const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Top 10 AI Tools in 2025',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    status: 'published',
    platform: 'YouTube'
  },
  {
    id: '2',
    title: 'How to build a SaaS fast',
    date: new Date().toISOString().split('T')[0],
    time: '02:00 PM',
    status: 'pending',
    platform: 'TikTok'
  },
  {
    id: '3',
    title: 'Flowsstack Feature Reveal',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    time: '09:00 AM',
    status: 'pending',
    platform: 'Instagram'
  },
  {
    id: '4',
    title: 'Weekly Q&A Shorts',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    time: '05:00 PM',
    status: 'failed',
    platform: 'YouTube Shorts'
  }
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch real data
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const webhookUrl = localStorage.getItem('fc_webhook_url');
        if (!webhookUrl) return;

        setIsLoading(true);
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'get_calendar' }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.events && Array.isArray(data.events)) {
            setEvents(data.events);
          }
        }
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarData();
  }, []);

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Calendar logic
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return events.filter(e => e.date === dateString);
  };

  const getStatusConfig = (status: EventStatus) => {
    switch (status) {
      case 'published':
        return { icon: CheckCircle2, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' };
      case 'pending':
        return { icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' };
      case 'failed':
        return { icon: AlertCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' };
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-8 h-8 text-orange-500" />
            Content Calendar
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Schedule and track your automated video publications.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md hover:shadow-lg">
          <Plus className="w-5 h-5" />
          Schedule Video
        </button>
      </div>

      {/* Calendar Card */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Calendar Controls */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 font-medium text-sm transition-colors"
            >
              Today
            </button>
            <button 
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 auto-rows-fr bg-slate-200 dark:bg-slate-800 gap-px border-b border-slate-200 dark:border-slate-800">
          {days.map((date, i) => {
            const dayEvents = getEventsForDate(date);
            const isToday = date && date.toDateString() === new Date().toDateString();
            
            return (
              <div 
                key={i} 
                className={`min-h-[120px] p-2 bg-white dark:bg-slate-950 transition-colors ${
                  !date ? 'bg-slate-50 dark:bg-slate-900/50' : 'hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                {date && (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                        isToday 
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm' 
                          : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {date.getDate()}
                      </span>
                    </div>
                    <div className="space-y-1.5 overflow-y-auto max-h-[80px] pr-1 custom-scrollbar">
                      {dayEvents.map(event => {
                        const { icon: StatusIcon, color, bg } = getStatusConfig(event.status);
                        return (
                          <div 
                            key={event.id}
                            className={`p-1.5 rounded-md border border-slate-100 dark:border-slate-800 ${bg} flex flex-col gap-1 cursor-pointer hover:opacity-80 transition-opacity`}
                            title={`${event.title} - ${event.time}`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate flex-1">
                                {event.title}
                              </span>
                              <StatusIcon className={`w-3.5 h-3.5 shrink-0 ${color}`} />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                                {event.time}
                              </span>
                              <span className="text-[10px] font-medium px-1.5 rounded bg-white/50 dark:bg-black/20 text-slate-600 dark:text-slate-300">
                                {event.platform}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Footer info */}
        <div className="p-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Published</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>Failed</span>
            </div>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Syncing...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
