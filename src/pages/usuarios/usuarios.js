import { BasicLayout, BasicModal } from '@/layouts'
import { ProtectedRoute, Title, ToastSuccess } from '@/components/Layouts'
import { useAuth } from '@/contexts/AuthContext'
import { ModUsuarioForm, UsuariosLista } from '@/components/Usuarios'
import { useState } from 'react'
import styles from './usuarios.module.css'
import { UsuariosRowHeadMain } from '@/components/Usuarios'

export default function Usuarios() {

  const [reload, setReload] = useState()

  const onReload = () => setReload((prevState) => !prevState)

  const [show, setShow] = useState(false)

  const [setToastSuccess] = useState(false)

  const onToastSuccess = () => setToastSuccess((prevState) => !prevState)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const {user} = useAuth()

  return (

    <ProtectedRoute>

      <BasicLayout relative categorie='usuario'>

        <Title title='Usuarios' />

        <UsuariosRowHeadMain rowMain />

        <UsuariosLista reload={reload} onReload={onReload} />

        <BasicModal title='modificar usuario' show={show} onClose={onOpenClose}>
          
        </BasicModal>

      </BasicLayout>

    </ProtectedRoute>

  )
}
