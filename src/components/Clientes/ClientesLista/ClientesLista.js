import { useEffect, useState } from 'react'
import axios from 'axios'
import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import styles from './ClientesLista.module.css'
import { formatId } from '@/helpers'

export function ClientesLista() {

  const [clientes, setClientes] = useState()

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/clientes')
        setClientes(response.data)
      } catch (error) {
          console.error('Error al obtener los clientes:', error)
      }
    })()
  }, [clientes])

  return (
    
    <>
    
      {!clientes ? (
        <Loading size={45} />
      ) : (
        size(clientes) === 0 ? (
          <ListEmpty />
        ) : (
        
        <div className={styles.main}>
          {map(clientes, (cliente) => (
            <div key={cliente.id} className={styles.rowMap}>
              <h1>{formatId(cliente.id)}</h1>
              <h1>{cliente.cliente}</h1>
              <h1>{cliente.contacto}</h1>
              <h1>{cliente.cel}</h1>
              <h1>{cliente.direccion}</h1>
              <h1>{cliente.email}</h1>
            </div>
          ))}
        </div>

      ))}

    </>

  )
}
