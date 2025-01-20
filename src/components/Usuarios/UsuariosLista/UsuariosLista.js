import { useEffect, useState } from 'react'
import { size, map } from 'lodash'
import styles from './UsuariosLista.module.css'
import axios from 'axios'
import { ListEmpty, Loading } from '@/components/Layouts'
import { FaUser } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { UsuarioDetalles } from '../UsuarioDetalles'

export function UsuariosLista(props) {

  const { user, loading, reload, onReload, usuarios, onToastSuccessMod } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)

  const onOpenDetalles = (usuario) => {
    setUsuarioSeleccionado(usuario)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setUsuarioSeleccionado(null)
    setShowDetalles(false)
  }

  return (

    <>

      {!usuarios ? (
        <Loading size={45} loading={1} />
      ) : (
        size(usuarios) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(usuarios, (usuario) => (
              <div key={usuario.id} className={styles.section} onClick={() => onOpenDetalles(usuario)}>
                <div>
                  <div className={styles.column1}>
                    <FaUser />
                  </div>
                  <div className={styles.column2}>
                    <div >
                      <h1>Nombre</h1>
                      <h2>{usuario.nombre}</h2>
                    </div>
                    <div >
                      <h1>Usuario</h1>
                      <h2>{usuario.usuario}</h2>
                    </div>
                  </div>
                </div>
              </div>
            )
            )}
          </div>
        )
      )}

      <BasicModal title='detalles del usuario' show={showDetalles} onClose={onCloseDetalles}>
        <UsuarioDetalles user={user} loading={loading} reload={reload} onReload={onReload} usuario={usuarioSeleccionado} onCloseDetalles={onCloseDetalles} onToastSuccessMod={onToastSuccessMod} />
      </BasicModal>

    </>

  )
}
