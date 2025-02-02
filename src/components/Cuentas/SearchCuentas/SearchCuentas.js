import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from 'semantic-ui-react';
import { CuentasListSearch } from '../CuentasListSearch';
import { FaTimesCircle } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import styles from './SearchCuentas.module.css';

export function SearchCuentas(props) {

  const {reload, onReload, onResults, onOpenCloseSearch, onToastSuccessMod} = props

  const {user} = useAuth()

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cuentas, setCuentas] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim() === '') {
        setCuentas([])
        return
      }

      setLoading(true)
      setError('')

      try {
        const res = await axios.get(`/api/cuentas/cuentas?search=${query}`)
        setCuentas(res.data)
      } catch (err) {
        setError('No se encontraron cuentas')
        setCuentas([])
      } finally {
        setLoading(false)
      }
    };

    fetchData()
  }, [query])

  return (
    <div className={styles.main}>

      <div className={styles.input}>
        <Input
          type="text"
          placeholder="Buscar cuenta..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
          loading={loading}
        />
        <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
          <FaTimesCircle />
        </div>
      </div>

      <div className={styles.visitaLista}>
        {error && <p>{error}</p>}
        {cuentas.length > 0 && (
          <div className={styles.resultsContainer}>
            <CuentasListSearch cuentas={cuentas} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
          </div>
        )}
      </div>
    </div>
  )
}
