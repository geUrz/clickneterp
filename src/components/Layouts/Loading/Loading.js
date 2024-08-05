import { MoonLoader } from 'react-spinners'
import styles from './Loading.module.css'
import classNames from 'classnames'

export function Loading(props) {

  const {size, loading} = props

  const loadingClass = classNames({
    [styles.loadingLarge]: loading === true, 
    [styles.loadingMini]: loading === false 
  });

  return (
    
    <div className={loadingClass}>
      <MoonLoader
        color='orange'
        size={size}
        speedMultiplier={1}
      />
    </div>

  )
}
