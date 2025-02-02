import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { BasicLayout, BasicModal } from '@/layouts'
import { Add, Loading, Title, ToastSuccess } from '@/components/Layouts'
import { useAuth } from '@/contexts/AuthContext'
import { SearchUsuarios, UsuarioForm, UsuariosLista, UsuariosListSearch } from '@/components/Usuarios'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { FaSearch } from 'react-icons/fa'
import styles from './usuarios.module.css'

export default function Usuarios() {

  const { user, loading } = useAuth()

  const [reload, setReload] = useState()

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [search, setSearch] = useState(false)

  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)

  const [resultados, setResultados] = useState([])

  const [usuarios, setUsuarios] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/usuarios/usuarios')
        setUsuarios(res.data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [user, reload])

  const [toastSuccess, setToastSuccess] = useState(false)
  const [toastSuccessMod, setToastSuccessMod] = useState(false)

  const onToastSuccess = () => {
    setToastSuccess(true)
    setTimeout(() => {
      setToastSuccess(false)
    }, 3000)
  }

  const onToastSuccessMod = () => {
    setToastSuccessMod(true)
    setTimeout(() => {
      setToastSuccessMod(false)
    }, 3000)
  }

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout relative categorie='usuario' onReload={onReload}>

        {toastSuccess&& <ToastSuccess contain='Creado exitosamente' onClose={() => setToastSuccessUsuario(false)} />}

        {toastSuccessMod && <ToastSuccess contain='Modificado exitosamente' onClose={() => setToastSuccessUsuarioMod(false)} />}

        <Title title='Usuarios' />

        {!search ? (
          ''
        ) : (
          <div className={styles.searchMain}>
            <SearchUsuarios user={user} onResults={setResultados} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
            {resultados.length > 0 && (
              <UsuariosListSearch visitas={resultados} reload={reload} onReload={onReload} />
            )}
          </div>
        )}

        {!search ? (
          <div className={styles.iconSearchMain}>
            <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
              <h1>Buscar usuario</h1>
              <FaSearch />
            </div>
          </div>
        ) : (
          ''
        )}

        {user && user.nivel === 'Admin' ?
          <Add onOpenClose={onOpenCloseForm} /> : null
        }

        <UsuariosLista user={user} loading={loading} reload={reload} onReload={onReload} usuarios={usuarios} onToastSuccessMod={onToastSuccessMod} />

      </BasicLayout>

      <BasicModal title='crear usuario' show={openForm} onClose={onOpenCloseForm}>
        <UsuarioForm reload={reload} onReload={onReload} onOpenCloseForm={onOpenCloseForm} onToastSuccess={onToastSuccess} />
      </BasicModal>

    </ProtectedRoute>

  )
}
