import { map } from 'lodash'
import { Loading } from '@/components/Layouts'
import { formatCurrency } from '@/helpers'
import styles from './CuentaConceptos.module.css'

export function CuentaConceptos(props) {

  const { conceptos, onOpenCloseEditConcep } = props

  return (

    <>

      {!conceptos ?
        <Loading size={30} loading={2} />
        :
        <div className={styles.main}>
          {map(conceptos, (concepto) => (
            <div key={concepto.id} className={styles.rowMap} onClick={() => onOpenCloseEditConcep(concepto)}>
              <h1>{concepto.tipo}</h1>
              <h1>{concepto.concepto}</h1>
              <h1>${formatCurrency(concepto.precio * 1)}</h1>
              <h1>{concepto.cantidad}</h1>
              <h1>${formatCurrency(concepto.precio * concepto.cantidad)}</h1>
            </div>
          ))}
        </div>
      }

    </>

  )
}
