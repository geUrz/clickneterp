import { BasicLayout } from '@/layouts';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendario, CalendarioForm } from '@/components/Tareas';
import { ProtectedRoute } from '@/components/Layouts';

export default function Tareas() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/eventos');
        setEvents(response.data.map(event => ({
          ...event,
          inicio: new Date(event.inicio),
          final: new Date(event.final)
        })));
      } catch (error) {
        console.error('Error al obtener los eventos:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleEventAdded = (newEvent) => {
    setEvents([...events, { ...newEvent, inicio: new Date(newEvent.inicio), final: new Date(newEvent.final) }]);
  };

  return (

    <ProtectedRoute>

      <BasicLayout relative>

        <div className="container mx-auto">
          <h1 className="text-2xl font-bold my-4">Calendario</h1>
          <CalendarioForm onEventAdded={handleEventAdded} />
          <Calendario events={events} />
        </div>

      </BasicLayout>

    </ProtectedRoute>

  )
}
