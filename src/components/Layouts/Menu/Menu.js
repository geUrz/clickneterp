import { Image } from 'semantic-ui-react'
import { FaBars, FaHome, FaTimes, FaUserCircle } from 'react-icons/fa'
import { useState } from 'react'
import { FaClipboard, FaFileAlt, FaFileContract, FaFileInvoice, FaFileInvoiceDollar, FaPaperclip, FaUser, FaUsers } from 'react-icons/fa'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import styles from './Menu.module.css'

export function Menu() {

  const {user} = useAuth()

  const router = useRouter()

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
        <div className={styles.menuTop} onClick={() => router.push('usuario')}>
          <FaUserCircle />
          <h1>{user.usuario}</h1>
        </div>
        <div className={styles.menuList}>
          <Link href='/'>
            <FaHome />
            <h1>Panel</h1>
          </Link>
          <Link href='recibos'>
            <FaFileInvoice />
            <h1>Recibos</h1>
          </Link>
          <Link href='ordenesdeservicio'>
            <FaFileAlt />
            <h1>Órdenes de servicio</h1>
          </Link>
          <Link href='cotizaciones'>
            <FaFileContract />
            <h1>Cotizaciones</h1>
          </Link>
          <Link href='reportes'>
            <FaClipboard />
            <h1>Reportes</h1>
          </Link>
          <Link href='cuentas'>
            <FaFileInvoiceDollar />
            <h1>Cuentas</h1>
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
