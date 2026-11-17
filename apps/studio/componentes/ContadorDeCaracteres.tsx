// Muestra cuántos caracteres lleva el campo. Es solo informativo: nunca bloquea «Publicar». La guía (título de unos 60
// y descripción de unos 155) vive en la descripción de cada campo.
import type {StringInputProps} from 'sanity'

export function ContadorDeCaracteres(props: StringInputProps) {
  const largo = typeof props.value === 'string' ? props.value.length : 0
  return (
    <div>
      {props.renderDefault(props)}
      <p style={{margin: '0.5em 0 0', fontSize: '0.8125rem', opacity: 0.7}}>
        {largo} {largo === 1 ? 'carácter' : 'caracteres'}
      </p>
    </div>
  )
}
