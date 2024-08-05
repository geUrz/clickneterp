import { useEffect, useState } from 'react'
import styles from './RecibosLista.module.css'
import axios from 'axios'
import { map, size } from 'lodash'
import { FaCog } from 'react-icons/fa'
import { formatClientId, formatId } from '@/helpers'
import { Loading, ListEmpty } from '@/components/Layouts'
import { BasicModal } from '@/layouts'
import { ReciboDetalles } from '../ReciboDetalles'

export function RecibosLista() {

  const [show, setShow] = useState(false)

  const [recibos, setRecibos] = useState()
  const [reciboSeleccionado, setReciboSeleccionado] = useState(null)

  useEffect(() => {
    const fetchRecibos = async () => {
      try {
        const response = await axios.get('/api/recibos')
        setRecibos(response.data);
      } catch (error) {
        console.error('Error al obtener los recibos:', error)
      }
    }
    fetchRecibos()
  }, [])

  const onOpenClose = async (recibo) => {
    try {
      const response = await axios.get(`/api/conceptos?recibo_id=${recibo.id}`)
      recibo.conceptos = response.data
      setReciboSeleccionado(recibo)
      setShow((prevState) => !prevState)
    } catch (error) {
      console.error('Error al obtener los conceptos:', error)
    }
  }

  return (

    <>

      {!recibos ? (
        <Loading size={45} loading />
      ) : (
        size(recibos) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(recibos, (recibo) => (
              <div key={recibo.id} className={styles.rowMap} onClick={() => onOpenClose(recibo)}>
                <h1>{formatId(recibo.id)}</h1>
                <h1>{recibo.cliente}</h1>
                <h1>{recibo.descripcion}</h1>
                <h1><FaCog /></h1>
              </div>
            ))}
          </div>
        )
      )}

      <BasicModal title='detalles del recibo' show={show} onClose={onOpenClose}>
        <ReciboDetalles recibos={reciboSeleccionado} onOpenClose={onOpenClose} />
      </BasicModal>

    </>

  )
}
