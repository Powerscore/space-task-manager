import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAuth } from '../AuthContext';
import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios';

export default function TaskCalendar() {
  const { user, signOut } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens.idToken.toString();
        const resp = await axios.get(
          'https://mye64ogig2.execute-api.eu-north-1.amazonaws.com/stage-cors/tasks',
          { headers: { Authorization: token } }
        );
        const raw = resp.data.tasks || [];
        const evts = raw.map(item => {
          const priority = item.priority.S.toLowerCase();
          let color;
          switch (priority) {
            case 'high': color = '#dc2626'; break;
            case 'medium': color = '#f59e0b'; break;
            case 'low': color = '#10b981'; break;
            default: color = '#3b82f6';
          }
          return {
            id: item.task_id.S,
            title: item.title.S,
            date: item.dueDate.S,
            backgroundColor: color,
            borderColor: color,
            textColor: '#ffffff'
          };
        });
        setEvents(evts);
      } catch (e) {
        console.error(e);
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  if (loading) return <p className="text-center py-8">Loading calendar...</p>;
  if (error) return <p className="text-red-600 text-center py-8">{error}</p>;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col">
      {/* Header/Navigation Area */}
      <header className="py-4 px-6 md:px-12 shadow-sm border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-purple-600">
            SpaceTaskManager
          </Link>
          <nav className="flex items-center space-x-4">
            <Link to="/tasks" className="text-gray-600 hover:text-purple-600  font-semibold">
              My Tasks
            </Link>
            <Link to="/calendar" className="text-purple-600 hover:text-purple-800 font-medium">
              Calendar
            </Link>
            {user && (
              <button
                onClick={signOut}
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