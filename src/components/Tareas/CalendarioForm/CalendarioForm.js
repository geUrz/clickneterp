import styles from './CalendarioForm.module.css';
import { useState } from 'react';
import { Button, Form, FormField, FormGroup, Input, Label } from 'semantic-ui-react';
import axios from 'axios';

export function CalendarioForm(props) {
  const { onEventAdded } = props;

  const [newEvent, setNewEvent] = useState({ titulo: '', inicio: '', final: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/eventos', newEvent);
      onEventAdded(newEvent);
      setNewEvent({ titulo: '', inicio: '', final: '' });
    } catch (error) {
      console.error('Error al añadir el evento:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup widths='equal'>
        <FormField>
          <Label>Tarea</Label>
          <Input
            type="text"
            name="titulo"
            value={newEvent.titulo}
            onChange={handleInputChange}
            placeholder="Título del evento"
            required
          />
        </FormField>
        <FormField>
          <Label>Fecha inicio</Label>
          <Input
            type="datetime-local"
            name="inicio"
            value={newEvent.inicio}
            onChange={handleInputChange}
            required
          />
        </FormField>
        <FormField>
          <Label>Fecha final</Label>
          <Input
            type="datetime-local"
            name="final"
            value={newEvent.final}
            onChange={handleInputChange}
            required
          />
        </FormField>
      </FormGroup>
      <Button type="submit">Añadir Evento</Button>
    </Form>
  );
}
