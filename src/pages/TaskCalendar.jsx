import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { useAuth } from 'react-oidc-context';

export default function TaskCalendar() {
  const auth = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
      if (!auth.user?.id_token) {
        setError("Authentication token is missing. Please sign in.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const token = auth.user.id_token;
        const resp = await axios.get(
          'https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/tasks',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const raw = resp.data.tasks || [];
        const evts = raw.map(item => {
          const priority = item.priority?.S?.toLowerCase() || 'medium';
          let color;
          switch (priority) {
            case 'high':
              color = '#EF4444';
              break;
            case 'medium':
              color = '#F59E0B';
              break;
            case 'low':
              color = '#10B981';
              break;
            default:
              color = '#6B7280';
          }
          return {
            id: item.task_id?.S,
            title: item.title?.S,
            date: item.dueDate?.S,
            backgroundColor: color,
            borderColor: color,
            textColor: '#ffffff'
          };
        });
        setEvents(evts);
        setError(null);
      } catch (e) {
        console.error("Error loading tasks for calendar:", e);
        setError(e.response?.data?.message || e.message || 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    if (auth.isAuthenticated) {
      loadTasks();
    } else if (!auth.isLoading && !auth.isAuthenticated) {
      setError("Please sign in to view the calendar.");
      setLoading(false);
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.user?.id_token]);

  const handleSignOut = () => {
    const postLogoutRedirectUri = window.location.origin + '/';
    auth.signoutRedirect({ post_logout_redirect_uri: postLogoutRedirectUri });
  };

  if (auth.isLoading || loading) {
    return <div className="w-full min-h-screen flex items-center justify-center text-lg">Loading calendar...</div>;
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        {!auth.isAuthenticated && (
          <button
            onClick={() => auth.signinRedirect()}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center">
        <header className="w-full py-4 px-6 md:px-12 border-b border-gray-200 bg-white">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-purple-600">
              SpaceTaskManager
            </Link>
          </div>
        </header>
        <main className="flex-grow container mx-auto flex flex-col items-center justify-center py-12 px-4">
          <p className="text-xl text-gray-700 mb-6">Please sign in to view the task calendar.</p>
          <button
            onClick={() => auth.signinRedirect()}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md text-lg font-semibold transition-colors"
          >
            Sign In
          </button>
        </main>
        <footer className="w-full py-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Space Task Manager
        </footer>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col">
      <header className="py-4 px-6 md:px-12 shadow-sm border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-purple-600">
            SpaceTaskManager
          </Link>
          <nav className="flex items-center space-x-4">
            <Link to="/tasks" className="text-gray-600 hover:text-purple-600 font-semibold">
              My Tasks
            </Link>
            <Link to="/calendar" className="text-purple-600 hover:text-purple-800 font-medium">
              Calendar
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-purple-600 font-medium">Profile</Link>
            {auth.isAuthenticated && (
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Task Calendar
        </h1>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prevYear,prev,next,nextYear today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek'
            }}
            buttonText={{ today: 'Today', month: 'Month', week: 'Week' }}
            events={events}
            dayMaxEvents={true}
            height="auto"
            weekendClassNames="bg-gray-50"
            dateClick={(info) => console.log('Date clicked:', info.dateStr)}
            eventClick={(info) => window.location.href = `/tasks/${info.event.id}`}
          />
        </div>
      </main>
    </div>
  );
}