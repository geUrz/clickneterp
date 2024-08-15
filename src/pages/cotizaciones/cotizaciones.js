import { BasicLayout, BasicModal } from '@/layouts'
import styles from './cotizaciones.module.css'
import { Add, ProtectedRoute, Title, ToastSuccess } from '@/components/Layouts'
import { CotForm, CotLista, CotRowHeadMain } from '@/components/Cotizaciones'
import { useState } from 'react'

export default function Cotizaciones() {

  const [reload, setReload] = useState()

  const onReload = () => setReload((prevState) => !prevState)

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const [toastSuccess, setToastSuccess] = useState(false)

  const onToastSuccess = () => setToastSuccess((prevState) => !prevState)

  return (

    <ProtectedRoute>
    
      <BasicLayout relative onReload={onReload}>

        <Title title='cotizaciones' />

        {toastSuccess && <ToastSuccess contain='Cotización creada exitosamente' onClose={() => setToastSuccess(false)} />}

        <CotRowHeadMain rowMain />

        <CotLista reload={reload} onReload={onReload} />

        <Add onOpenClose={onOpenClose} />

        <BasicModal title='Crear cotización' show={show} onClose={onOpenClose}>
          <CotForm reload={reload} onReload={onReload} onOpenClose={onOpenClose} onToastSuccess={onToastSuccess} />
        </BasicModal>

      </BasicLayout>

    </ProtectedRoute>

  )
}
