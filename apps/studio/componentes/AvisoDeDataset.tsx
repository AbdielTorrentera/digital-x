// Franja fija sobre la barra del Studio que dice en qué dataset se está editando. El nombre sale del dataset real al que
// está conectado el workspace (no de un texto a mano), así que no puede decir «Producción» estando en pruebas.
// Existe porque una vez se editó en pruebas creyendo que era el sitio.
import {useDataset, type NavbarProps} from 'sanity'
import {datasetProduccion} from '@digitalx/sanity/config'

export function AvisoDeDataset(props: NavbarProps) {
  const dataset = useDataset()
  const esProduccion = dataset === datasetProduccion
  return (
    <>
      <div
        role="status"
        style={{
          boxSizing: 'border-box',
          width: '100%',
          padding: '0.5rem 1rem',
          textAlign: 'center',
          fontSize: '0.875rem',
          lineHeight: 1.4,
          fontWeight: 600,
          // Contraste alto en los dos casos: texto oscuro sobre ámbar y texto blanco sobre azul marino.
          background: esProduccion ? '#14213d' : '#ffc233',
          color: esProduccion ? '#ffffff' : '#1a1a1a',
        }}
      >
        {esProduccion
          ? `PRODUCCIÓN · dataset ${dataset} · Lo que publiques aquí sale en el sitio en unos 5 minutos`
          : `PRUEBAS · dataset ${dataset} · Lo que publiques aquí NO sale en el sitio`}
      </div>
      {props.renderDefault(props)}
    </>
  )
}
