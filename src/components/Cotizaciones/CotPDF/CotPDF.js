import { BiSolidFilePdf } from 'react-icons/bi'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import QRCode from 'qrcode'
import { formatCurrency, formatDate, formatId } from '@/helpers'
import styles from './CotPDF.module.css'

export function CotPDF(props) {

  const {cliente, cotizaciones, conceptos} = props

  const generarPDF = async () => {

    if (!cotizaciones) return

    const toggleIVA = JSON.parse(localStorage.getItem('ontoggleIVA') || 'true');

    const doc = new jsPDF(
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      }
    )

    /* const logoImg = 'img/logo.png'
    const logoWidth = 30
    const logoHeight = 8
    doc.addImage(logoImg, 'PNG', 15, 14, logoWidth, logoHeight) */

    doc.setFont('helvetica')

    const marginRight = 15
    const font1 = 12
    const font2 = 10
    const font3 = 9

    doc.setFontSize(`${font1}`)
    doc.setTextColor(0, 0, 0)
    doc.text('CLICKNET', 15, 20)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text('Punta Este Corporativo', 15, 124)
    doc.text('Calzada Carranza 951', 15, 28)
    doc.text('Piso 10 Suite 304, Interior "E"', 15, 32)
    doc.text('C.P. 2125', 15, 36)
    doc.setFontSize(`${font3}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Juan Roberto Espinoza Espinoza', 15, 40)
    doc.setFontSize(`${font3}`)
    doc.setTextColor(120, 120, 120)
    doc.text('RFC: EIEJ8906244J3', 15, 44)

    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Cliente', 15, 60)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text(`${cotizaciones.cliente}`, 15, 64)

    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('COTIZACIÓN', doc.internal.pageSize.width - marginRight - doc.getTextWidth('COTIZACIÓN'), 60)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Folio', doc.internal.pageSize.width - marginRight - doc.getTextWidth('Folio'), 66)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text(`# ${formatId(cotizaciones.id)}`, doc.internal.pageSize.width - marginRight - doc.getTextWidth(`# ${formatId(cotizaciones.id)}`), 70)

    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Contacto', 15, 70)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text(`${cliente.contacto}`, 15, 74)

    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Fecha/Hora', doc.internal.pageSize.width - marginRight - doc.getTextWidth('Fecha/Hora'), 74)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text(
      `${formatDate(cotizaciones.createdAt)}`,
      doc.internal.pageSize.width - 13.9 - doc.getTextWidth(`${formatDate(cotizaciones.createdAt)}`),
      78
    )

    doc.autoTable({
      startY: 85,
      head: [
        [
          { content: 'Tipo', styles: { halign: 'center' } },
          { content: 'Concepto', styles: { halign: 'left' } },
          { content: 'Precio', styles: { halign: 'right' } },
          { content: 'Qty', styles: { halign: 'center' } },
          { content: 'Total', styles: { halign: 'right' } },         
        ]
      ],
      styles: {
        cellPadding: 1,
        cellWidth: 'auto',
      },
      body: conceptos.map(concepto => [
        { content: `${concepto.tipo}`, styles: { halign: 'center' } }, 
        { content: `${concepto.concepto}`, styles: { halign: 'left' } }, 
        { content: `$${formatCurrency(concepto.precio)}`, styles: { halign: 'right' } },  
        { content: `${concepto.cantidad}`, styles: { halign: 'center' } },  
        { content: `$${formatCurrency(concepto.precio * concepto.cantidad)}`, styles: { halign: 'right' } },  
        ]),
      headStyles: { fillColor: [0, 150, 170], fontSize: 6.8 },
      bodyStyles: { fontSize: 6.2 },
      columnStyles: {
        0: {
          cellPadding: 1,
          cellWidth: 'auto', 
          valign: 'middle'
        },
        1: {
          cellPadding: 1,
          cellWidth: 'auto', 
          valign: 'middle'
        },
        2: {
          cellPadding: 1,
          cellWidth: 'auto', 
          valign: 'middle'
        },
        3: {
          cellPadding: 1,
          cellWidth: 'auto', 
          valign: 'middle'
        },
        4: {
          cellPadding: 1,
          cellWidth: 'auto', 
          valign: 'middle'
        }
      },

      margin: { top: 0, left: 4.5, bottom: 0, right: 4.5 },

    })

    const calcularTotales = () => {
      const subtotal = conceptos.reduce((acc, curr) => acc + curr.cantidad * curr.precio, 0);
      const iva = subtotal * 0.16;
      const total = toggleIVA ? subtotal + iva : subtotal;
      return { subtotal, iva, total };
    };
  
    const { subtotal, iva, total } = calcularTotales();

    const verticalData = [
      ...toggleIVA ? [
        ['Subtotal:', `$${formatCurrency(subtotal)}`],
        ['IVA:', `$${formatCurrency(iva)}`],
      ] : [],
      ['Total:', `$${formatCurrency(total)}`]
    ];
    
    doc.autoTable({
      startY: 124,
      margin: { left: 67.5, bottom: 0, right: 4.5 },
      body: verticalData, 
      styles: {
        cellPadding: 1,
        valign: 'middle',
        fontSize: 7,
      },
      columnStyles: {
        0: { cellWidth: 15, fontStyle: 'bold', halign: 'right' },
        1: { cellWidth: 18, halign: 'right' }  
      }
    })


    const qrCodeText = 'https://www.facebook.com/clicknet.mx'
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeText)
    doc.addImage(qrCodeDataUrl, 'PNG', 2, 118, 25, 25)

    doc.save(`Cotización_${formatId(cotizaciones.id)}.pdf`)
  }

  return (
    
    <div className={styles.iconPDF}>
      <div onClick={generarPDF}>
        <BiSolidFilePdf />
      </div>
    </div>

  )
}
