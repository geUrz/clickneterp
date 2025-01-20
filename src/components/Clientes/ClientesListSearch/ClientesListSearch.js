import { map } from 'lodash'
import { FaUsers } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { useState } from 'react'
import { Loading } from '@/components/Layouts'
import { ClienteDetalles } from '../ClienteDetalles'
import styles from './ClientesListSearch.module.css'

export function ClientesListSearch(props) {

  const { reload, onReload, clientes, toastSuccessMod, toastSuccessDel } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [clienteSeleccionado, setClienteSeleccionada] = useState(null)

  const onOpenDetalles = (cliente) => {
    setClienteSeleccionada(cliente)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setClienteSeleccionada(null)
    setShowDetalles(false)
  }

  return (

    <>

      {!clientes ?
        <Loading size={45} loading={1} /> :
        <div className={styles.main}>
          {map(clientes, (cliente) => (
              <div key={cliente.id} className={styles.section} onClick={() => onOpenDetalles(cliente)}>
                <div>
                  <div className={styles.column1}>
                    <FaUsers />
                  </div>
                  <div className={styles.column2}>
                    <div>
                      <h1>Nombre</h1>
                      <h2>{cliente.nombre}</h2>
                    </div>
                    <div>
                      <h1>Cel</h1>
                      <h2>{cliente.cel}</h2>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      }

      <BasicModal title='detalles de la cliente' show={showDetalles} onClose={onCloseDetalles}>
        {clienteSeleccionado && (
          <ClienteDetalles
            reload={reload}
            onReload={onReload}
            cliente={clienteSeleccionado}
            onCloseDetalles={onCloseDetalles}
            toastSuccessMod={toastSuccessMod}
            toastSuccessDel={toastSuccessDel}
          />
        )}
      </BasicModal>

    </>

  )
}
