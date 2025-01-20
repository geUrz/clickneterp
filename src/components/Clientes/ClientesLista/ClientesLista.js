import { useEffect, useState } from 'react'
import axios from 'axios'
import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { FaUsers } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { ClienteDetalles } from '../ClienteDetalles'
import styles from './ClientesLista.module.css'

export function ClientesLista(props) {

  const {reload, onReload, clientes, toastSuccessMod, toastSuccessDel} = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenDetalles = (cliente) => {
    setClienteSeleccionado(cliente)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setClienteSeleccionado(null)
    setShowDetalles(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 800) 

    return () => clearTimeout(timer)
  }, [])

  return (
    
    <>
    
    {showLoading ? (
        <Loading size={45} loading={1} />
      ) : (
        size(clientes) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.mainRow}>
            {map(clientes, (cliente) => (
              <div key={cliente.id} className={styles.mainRowMap} onClick={() => onOpenDetalles(cliente)}>
                <div className={styles.mainRowMap1}>
                  <FaUsers />
                </div>
                <div className={styles.mainRowMap2}>
                  <div>
                    <h1>Nombre</h1>
                    <h2>{cliente.nombre}</h2>
                  </div>
                  <div>
                    <h1>Celular</h1>
                    <h2>{cliente.cel}</h2>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <BasicModal title='detalles del cliente' show={showDetalles} onClose={onCloseDetalles}>
        <ClienteDetalles reload={reload} onReload={onReload} cliente={clienteSeleccionado} onCloseDetalles={onCloseDetalles} toastSuccessMod={toastSuccessMod} toastSuccessDel={toastSuccessDel} />
      </BasicModal>

    </>

  )
}
