import { BasicLayout, BasicModal } from '@/layouts'
import styles from './recibos.module.css'
import { Add, Title, ToastSuccess } from '@/components/Layouts'
import { useState } from 'react'
import { ReciboForm, RecibosLista, RecibosRowHeadMain } from '@/components/Recibos'

export default function Recibos(props) {

  const {rowMain=true} = props

  const [reload, setReload] = useState()

  const onReload = () => setReload((prevState) => !prevState)

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const[toastSuccess, setToastSuccess] = useState(false)

  const onToastSuccess = () => {
    setToastSuccess(true)
    setTimeout(() => {
      setToastSuccess(false)
    }, 3000)
  }

  return (
    
    <BasicLayout relative onReload={onReload}>

      <Title title='Recibos' />
      
      {toastSuccess && <ToastSuccess contain='Recibo creado exitosamente' onClose={() => setToast(false)} />}

      <RecibosRowHeadMain rowMain={rowMain} />

      <RecibosLista />

      <Add onOpenClose={onOpenClose} />

      <BasicModal title='Crear recibo' show={show} onClose={onOpenClose}>
        <ReciboForm reload={reload} onReload={onReload} onOpenClose={onOpenClose} onToastSuccess={onToastSuccess} /> 
      </BasicModal>

    </BasicLayout>

  )
}
