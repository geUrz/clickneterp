import { useState } from 'react'
import { map, size } from 'lodash'
import axios from 'axios'
import { ListEmpty, Loading, ToastSuccess } from '@/components/Layouts'
import { FaFileInvoiceDollar } from 'react-icons/fa'
import { getValueOrDefault } from '@/helpers'
import { BasicModal } from '@/layouts'
import { CuentaDetalles } from '../CuentaDetalles'
import styles from './CuentasLista.module.css'

export function CuentasLista(props) {

  const { reload, onReload, cuentas, onToastSuccess, onToastSuccessMod, onToastSuccessDel } = props

  const [show, setShow] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  
  const [cuentaSeleccionado, setCuentaSeleccionado] = useState(null)
  const [toastSuccess, setToastSuccess] = useState(false)
  const [toastSuccessConfirm, setToastSuccessConfirm] = useState(false)
  const [toastSuccessDelete, setToastSuccessDelete] = useState(false)

  const onShowConfirm = () => setShowConfirm((prevState) => !prevState)

  const onOpenClose = async (cuenta) => {

    if (!cuenta || !cuenta.id) {
      setShow(false)
      return;
    }

    try {
      const response = await axios.get(`/api/cuentas/conceptos?cuenta_id=${cuenta.id}`)
      cuenta.conceptos = response.data
      setCuentaSeleccionado(cuenta)
      setShow((prevState) => !prevState)
    } catch (error) {
      console.error('Error al obtener los conceptos:', error)
      setShow(false)
    }
  }

  const onDeleteConcept = async (conceptoId) => {
    try {
      const response = await axios.delete(`/api/cuentas/conceptos`, {
        params: { concepto_id: conceptoId },
      })
      if (response.status === 200) {
        setCuentaSeleccionado((prevState) => ({
          ...prevState,
          conceptos: prevState.conceptos.filter((concepto) => concepto.id !== conceptoId),
        }))
      } else {
        console.error('Error al eliminar el concepto: Respuesta del servidor no fue exitosa', response);
      }
    } catch (error) {
      console.error('Error al eliminar el concepto:', error.response || error.message || error);
    }
  }

  const onAddConcept = (concept) => {
    setCuentaSeleccionado((prevState) => ({
      ...prevState,
      conceptos: [...prevState.conceptos, concept],
    }))
    onReload()
  }

  return (

    <>

      {toastSuccess && <ToastSuccess contain='Concepto creado exitosamente' onClose={() => setToastSuccess(false)} />}

      {toastSuccessConfirm && <ToastSuccess contain='Cuenta eliminado exitosamente' onClose={() => setToastSuccessConfirm(false)} />}

      {toastSuccessDelete && <ToastSuccess contain='Concepto eliminado exitosamente' onClose={() => setToastSuccessConfirm(false)} />}

      {!cuentas ? (
        <Loading size={45} loading={1} />
      ) : (
        size(cuentas) === 0 ? (
          <ListEmpty />
        ) : (
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
        )
      )}

      <BasicModal title='detalles de la cuenta' show={show} onClose={onOpenClose}>
        <CuentaDetalles cuenta={cuentaSeleccionado} cuentaId={cuentaSeleccionado} reload={reload} onReload={onReload} onShowConfirm={onShowConfirm} onOpenClose={onOpenClose} onToastSuccess={onToastSuccess} onToastSuccessMod={onToastSuccessMod} onToastSuccessDel={onToastSuccessDel} onAddConcept={onAddConcept} onDeleteConcept={onDeleteConcept} cuentaSeleccionado={setCuentaSeleccionado} />
      </BasicModal>

    </>

  )
}
