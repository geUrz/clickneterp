import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { FaFileAlt } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { OrdenesdeservicioDetalles } from '../OrdenesdeservicioDetalles'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getValueOrDefault } from '@/helpers'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './OrdenesdeservicioList.module.css'

export function OrdenesdeservicioList(props) {

  const { reload, onReload, ordservs, onToastSuccessMod, onToastSuccessDel } = props

  const { loading } = useAuth()

  const [showDetalles, setShowDetalles] = useState(false)
  const [ordendeservicioSeleccionado, setOrdendeservicioSeleccionada] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenDetalles = (ordserv) => {
    setOrdendeservicioSeleccionada(ordserv)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setOrdendeservicioSeleccionada(null)
    setShowDetalles(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 800) 

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (

    <>

      {showLoading ? (
        <Loading size={45} loading={1} />
      ) : (
        size(ordservs) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(ordservs, (ordserv) => (
                <div key={ordserv.id} className={styles.section} onClick={() => onOpenDetalles(ordserv)}>
                  <div>
                    <div className={styles.column1}>
                      <FaFileAlt />
                    </div>
                    <div className={styles.column2}>
                      <div >
                        <h1>Orden de servicio</h1>
                        <h2>{getValueOrDefault(ordserv.ordendeservicio)}</h2>
                      </div>
                      <div >
                        <h1>Cliente</h1>
                        <h2>{getValueOrDefault(ordserv.cliente_nombre)}</h2>
                      </div>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        )
      )}

      <BasicModal title='detalles de la orden de servicio' show={showDetalles} onClose={onCloseDetalles}>
        {ordendeservicioSeleccionado && (
          <OrdenesdeservicioDetalles
            reload={reload}
            onReload={onReload}
            ordserv={ordendeservicioSeleccionado}
            onCloseDetalles={onCloseDetalles}
            onToastSuccessMod={onToastSuccessMod}
            onToastSuccessDel={onToastSuccessDel}
          />
        )}
      </BasicModal>

    </>

  )
}
