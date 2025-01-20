import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from 'semantic-ui-react';
import { RecibosListSearch } from '../RecibosListSearch';
import { FaTimesCircle } from 'react-icons/fa';
import styles from './SearchRecibos.module.css';

export function SearchRecibos(props) {

  const {reload, onReload, onResults, onOpenCloseSearch, onToastSuccessMod} = props

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [recibos, setRecibos] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim() === '') {
        setRecibos([])
        return
      }

      setLoading(true)
      setError('')

      try {
        const res = await axios.get(`/api/recibos/recibos?search=${query}`)
        const uniqueRecibos = [...new Set(res.data.map(recibo => recibo.id))]
          .map(id => {
            return res.data.find(recibo => recibo.id === id);
          });

        setRecibos(uniqueRecibos)
      } catch (err) {
        setError('No se encontraron recibos')
        setRecibos([])
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
          placeholder="Buscar recibo..."
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
        {recibos.length > 0 && (
          <div className={styles.resultsContainer}>
            <RecibosListSearch recibos={recibos} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
          </div>
        )}
      </div>
    </div>
  )
}
