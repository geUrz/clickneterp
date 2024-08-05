import { Image } from 'semantic-ui-react'
import { FaBars, FaHome, FaTimes, FaUserCircle } from 'react-icons/fa'
import { useState } from 'react'
import { FaClipboard, FaFileAlt, FaFileContract, FaFileInvoice, FaFileInvoiceDollar, FaPaperclip, FaUser, FaUsers } from 'react-icons/fa'
import styles from './Menu.module.css'
import Link from 'next/link'

export function Menu() {

  const [menu, setMenu] = useState(false)

  const onMenu = () => setMenu((prevState) => !prevState)

  return (

    <>
    
      <div className={styles.mainTop}>
        <Link href='/'>
          <Image src='img/logo.webp' />
        </Link>
        <div className={styles.iconBar} onClick={onMenu}>
          {menu ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}
        </div>
      </div>

      <div className={styles.mainMenuSide} style={{left : menu ? '0' : '-100%'}} onClick={onMenu}>
        <div className={styles.menuTop}>
          <FaUserCircle />
          <h1>geraurz</h1>
        </div>
        <div className={styles.menuList}>
          <Link href='/'>
            <FaHome />
            <h1>Panel</h1>
          </Link>
          <Link href='tareas'>
            <FaPaperclip />
            <h1>Tareas</h1>
          </Link>
          <Link href='recibos'>
            <FaFileInvoice />
            <h1>Recibos</h1>
          </Link>
          <Link href='servicios'>
            <FaFileAlt />
            <h1>Servicios</h1>
          </Link>
          <Link href='cotizaciones'>
            <FaFileContract />
            <h1>Cotizaciones</h1>
          </Link>
          <Link href='reportes'>
            <FaClipboard />
            <h1>Reportes</h1>
          </Link>
          <Link href='contabilidad'>
            <FaFileInvoiceDollar />
            <h1>Contabilidad</h1>
          </Link>
          <Link href='clientes'>
            <FaUsers />
            <h1>Clientes</h1>
          </Link>
          <Link href='usuarios'>
            <FaUser />
            <h1>Usuarios</h1>
          </Link>
        </div>
      </div>
    
    </>

  )
}
