import { IconClose, ToastSuccess } from '@/components/Layouts'
import { formatClientId } from '@/helpers'
import { FaEdit } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { useState } from 'react'
import { UsuarioEditForm } from '../UsuarioEditForm'
import styles from './UsuarioDetalles.module.css'

export function UsuarioDetalles(props) {

  const { user, usuario, reload, onReload, onCloseDetalles, onToastSuccessMod } = props
  
  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  let isActive = ''

  if (usuario.isactive === 1) {
      isActive = 'Activo'
  } else {
      isActive = 'Inactivo'
  }

  return (

    <>

      <IconClose onOpenClose={onCloseDetalles} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Nombre</h1>
              <h2>{usuario.nombre}</h2>
            </div>
            <div>
              <h1>Usuario</h1>
              <h2>{usuario.usuario}</h2>
            </div>
            <div>
              <h1>Correo</h1>
              <h2>{usuario.email}</h2>
            </div>
            <div>
              <h1>Estatus</h1>
              <h2>{isActive}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Folio</h1>
              <h2>{usuario.folio}</h2>
            </div>
            <div>
              <h1>Cel</h1>
              <h2>{usuario.cel}</h2>
            </div>
            <div>
              <h1>Nivel</h1>
              <h2>{usuario.nivel}</h2>
            </div>
          </div>
        </div>

        {user && user.nivel === 'Admin' ? (
          <>

            <div className={styles.iconEdit}>
              <div onClick={onOpenClose}>
                <FaEdit />
              </div>
            </div>

          </>
        ) : (
          ''
        )}
      </div>

      <BasicModal title='Modificar usuario' show={show} onClose={onOpenClose}>
        <UsuarioEditForm reload={reload} onReload={onReload} usuario={usuario} onToastSuccessMod={onToastSuccessMod} onOpenClose={onOpenClose} />
      </BasicModal>

    </>

  )
}
