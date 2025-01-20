import { FaInfoCircle } from 'react-icons/fa'
import styles from './ListEmpty.module.css'

export function ListEmpty() {
  return (

    <div className={styles.section}>
      <div>
        <FaInfoCircle />
      </div>
    </div>

  )
}
