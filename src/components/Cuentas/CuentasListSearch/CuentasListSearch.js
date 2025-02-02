import { map } from 'lodash'
import { Loading } from '@/components/Layouts'
import { BasicModal } from '@/layouts'
import { useEffect, useState } from 'react'
import { CuentaDetalles } from '../CuentaDetalles'
import axios from 'axios'
import styles from './CuentasListSearch.module.css'
import { FaFileInvoiceDollar } from 'react-icons/fa'

export function CuentasListSearch(props) {

  const { reload, onReload, cuentas, onToastSuccessMod, onToastSuccessDel } = props

  const [show, setShow] = useState(false)
  const [cuentasSeleccionado, setCuentaSeleccionado] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenClose = async (cuenta) => {
    try {
      const response = await axios.get(`/api/cuentas/conceptos?cuenta_id=${cuenta.id}`)
      cuenta.conceptos = response.data
      setCuentaSeleccionado(cuenta)
      setShow((prevState) => !prevState)
    } catch (error) {
      console.error('Error al obtener los conceptos:', error)
    }
  }

  const onCloseDetalles = () => {
    setVisitaSeleccionada(null)
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

      {showLoading ? 
        <Loading size={45} loading={1} /> :
        <div className={styles.main}>
            {map(cuentas, (cuenta) => (
             <div key={cuenta.id} className={styles.section} onClick={() => onOpenClose(cuenta)}>
             <div>
               <div className={styles.column1}>
                 <FaFileInvoiceDollar />
               </div>
               <div className={styles.column2}>
                 <div>
                   <h1>Cuenta</h1>
                   <h2>{getValueOrDefault(cuenta.cuenta)}</h2>
                 </div>
                 <div>
                   <h1>Tipo</h1>
                   <h2>{getValueOrDefault(cuenta.tipo)}</h2>
                 </div>
               </div>
             </div>
           </div>
            ))}
          </div>
      }

      <BasicModal title='detalles de la cotización' show={show} onClose={onCloseDetalles}>
        {cuentasSeleccionado && (
          <CuentaDetalles
            reload={reload}
            onReload={onReload}
            cuenta={cuentasSeleccionado} 
            cuentaId={cuentasSeleccionado}
            onOpenClose={onOpenClose}
            onToastSuccessMod={onToastSuccessMod}
            onToastSuccessDel={onToastSuccessDel}
          />
        )}
      </BasicModal>

    </>

  )
}
