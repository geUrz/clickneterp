import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import styles from './ordenesdeservicio.module.css'
import { BasicLayout, BasicModal } from '@/layouts'
import { Add, Loading, Title, ToastDelete, ToastSuccess } from '@/components/Layouts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { FaSearch } from 'react-icons/fa'
import { OrdenesdeservicioForm, OrdenesdeservicioList, OrdenesdeservicioListSearch, SearchOrdenesdeservicio } from '@/components/Ordenesdeservicio'

export default function Ordenesdeservicio() {

  const { user, loading } = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [search, setSearch] = useState(false)

  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)

  const [resultados, setResultados] = useState([])

  const [ordservs, setOrdservs] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/ordenesdeserv/ordenesdeserv')
        setOrdservs(res.data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [reload])

  const [toastSuccess, setToastSuccess] = useState(false)
  const [toastSuccessMod, setToastSuccessMod] = useState(false)
  const [toastSuccessDel, setToastSuccessDel] = useState(false)

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

  const onToastSuccessDel = () => {
    setToastSuccessDel(true)
    setTimeout(() => {
      setToastSuccessDel(false)
    }, 3000)
  }

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout relative onReload={onReload}>

        {toastSuccess && <ToastSuccess contain='Creada exitosamente' onClose={() => setToastSuccess(false)} />}

        {toastSuccessMod && <ToastSuccess contain='Modificada exitosamente' onClose={() => setToastSuccessMod(false)} />}

        {toastSuccessDel && <ToastDelete contain='Eliminada exitosamente' onClose={() => setToastSuccessDel(false)} />}

        <Title title='órdenes de servicio' />

        {!search ? (
          ''
        ) : (
          <div className={styles.searchMain}>
            <SearchOrdenesdeservicio onResults={setResultados} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
            {resultados.length > 0 && (
              <OrdenesdeservicioListSearch visitas={resultados} reload={reload} onReload={onReload} />
            )}
          </div>
        )}

        {!search ? (
          <div className={styles.iconSearchMain}>
            <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
              <h1>Buscar orden de servicio</h1>
              <FaSearch />
            </div>
          </div>
        ) : (
          ''
        )}

        <OrdenesdeservicioList reload={reload} onReload={onReload} ordservs={ordservs} onToastSuccessMod={onToastSuccessMod} onToastSuccessDel={onToastSuccessDel} />

        <Add onOpenClose={onOpenCloseForm} />

      </BasicLayout>

      <BasicModal title='crear orden de servicio' show={openForm} onClose={onOpenCloseForm}>
        <OrdenesdeservicioForm reload={reload} onReload={onReload} onOpenCloseForm={onOpenCloseForm} onToastSuccess={onToastSuccess} />
      </BasicModal>

    </ProtectedRoute>

  )
}

