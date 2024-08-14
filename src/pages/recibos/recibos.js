import { BasicLayout, BasicModal } from '@/layouts'
import { Add, ProtectedRoute, Title, ToastSuccess } from '@/components/Layouts'
import { useState } from 'react'
import { ReciboForm, RecibosLista, RecibosRowHeadMain } from '@/components/Recibos'
import styles from './recibos.module.css'

export default function Recibos(props) {

  const { rowMain = true } = props

  const [reload, setReload] = useState()

  const onReload = () => setReload((prevState) => !prevState)

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const [toastSuccess, setToastSuccess] = useState(false)

  const onToastSuccess = () => {
    setToastSuccess(true)
    setTimeout(() => {
      setToastSuccess(false)
    }, 3000)
  }

  return (

    <ProtectedRoute>

      <BasicLayout relative onReload={onReload}>

        <Title title='Recibos' />

        {toastSuccess && <ToastSuccess contain='Recibo creado exitosamente' onClose={() => setToastSuccess(false)} />}

        <RecibosRowHeadMain rowMain={rowMain} />

        <RecibosLista reload={reload} onReload={onReload} />

        <Add onOpenClose={onOpenClose} />

        <BasicModal title='Crear recibo' show={show} onClose={onOpenClose}>
          <ReciboForm reload={reload} onReload={onReload} onOpenClose={onOpenClose} onToastSuccess={onToastSuccess} />
        </BasicModal>

      </BasicLayout>

    </ProtectedRoute>

  )
}
