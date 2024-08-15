import { useRef, useState } from 'react'
import SignaturePad from 'react-signature-canvas'
import styles from './FirmaDigital.module.css'
import { Button } from 'semantic-ui-react'

export function FirmaDigital(props) {

  const {onSave} = props

  const [trimmedDataURL, setTrimmedDataURL] = useState(null)
  const sigPad = useRef({})

  const clear = () => {
    sigPad.current.clear()
  }

  const trim = () => {
    const signature = sigPad.current.getTrimmedCanvas().toDataURL('image/png')
    setTrimmedDataURL(signature)
    onSave(signature)
  }

  return (
    <div className={styles.signatureContainer}>
      <SignaturePad 
        ref={sigPad} 
        penColor='azure'
        minWidth={1}
        maxWidth={1} 
        canvasProps={{ className: styles.signatureCanvas }} />
      <div className={styles.controls}>
        <Button secondary onClick={clear}>Limpiar</Button>
        <Button primary onClick={trim}>Firmar</Button>
      </div>
      {trimmedDataURL && (
        <img
          src={trimmedDataURL}
          alt="Firma Digital"
          className={styles.signatureImage}
        />
      )}
    </div>
  )
}
