import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/es'
import styles from './Calendario.module.css'

const localizer = momentLocalizer(moment)

moment.locale('es')

export function Calendario(props) {

  const {events } = props

  console.log(events);

  return (
    
    <div className={styles.main}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="inicio"
        endAccessor="final"
        style={{ height: 480 }}
        messages={{
          next: 'Sig.',
          previous: 'Ant.',
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
          date: 'Fecha',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'No hay eventos en este rango.',
          showMore: total => `+ Ver más (${total})`
        }}
      />
    </div>

  )
}
