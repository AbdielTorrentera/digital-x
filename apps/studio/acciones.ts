// Acciones protegidas del Studio. El Inicio nombra los servicios de cada categoría con marcadores ({servicios-video}…);
// si se despublica o elimina el último servicio de una categoría que el Inicio nombra, o la categoría misma, el sitio
// no podría construirse. Aquí se bloquean esas dos acciones con el motivo, para que el Studio nunca deje publicar (o
// quitar) algo que el sitio rechazaría.
import {useEffect, useState} from 'react'
import {useClient, type DocumentActionComponent, type DocumentActionsContext} from 'sanity'
import {categoriasDeMarcadores, motivoDeBloqueo, textosDe} from '@digitalx/sanity/reglas'
import {serviciosDeCategoria} from './validaciones'

const API_VERSION = '2025-01-01'
const ACCIONES_PROTEGIDAS = ['unpublish', 'delete']

type Cliente = ReturnType<typeof useClient>

async function motivoPara(tipo: string, id: string, cliente: Cliente): Promise<string | null> {
  const inicio = await cliente.fetch('*[_id == "inicio"][0]')
  const enElInicio = categoriasDeMarcadores([...textosDe(inicio)].map((t) => t.texto))
  if (enElInicio.length === 0) return null
  if (tipo === 'categoria') {
    const slug = await cliente.fetch<string | null>('*[_id == $id][0].slug.current', {id})
    return slug
      ? motivoDeBloqueo({
          categoria: slug,
          serviciosRestantes: 0,
          sinPagina: 0,
          categoriasEnElInicio: enElInicio,
        })
      : null
  }
  const slug = await cliente.fetch<string | null>('*[_id == $id][0].categoria->slug.current', {id})
  if (!slug) return null
  const {servicios, sinPagina} = await serviciosDeCategoria(slug, cliente)
  // Contando este servicio: si es el único publicado, al quitarlo no queda ninguno.
  return motivoDeBloqueo({
    categoria: slug,
    serviciosRestantes: servicios - 1,
    sinPagina,
    categoriasEnElInicio: enElInicio,
  })
}

/** Envuelve «Despublicar» y «Eliminar» de un servicio o una categoría para que no rompan los marcadores del Inicio. */
const proteger =
  (accion: DocumentActionComponent): DocumentActionComponent =>
  (props) => {
    const cliente = useClient({apiVersion: API_VERSION})
    const [motivo, setMotivo] = useState<string | null>(null)
    useEffect(() => {
      let vigente = true
      motivoPara(props.type, props.id, cliente).then(
        (m) => vigente && setMotivo(m),
        () => vigente && setMotivo(null),
      )
      return () => {
        vigente = false
      }
    }, [cliente, props.id, props.type])
    const original = accion(props)
    if (!original || !motivo) return original
    return {...original, disabled: true, title: motivo}
  }

/** Las acciones de cada tipo: los documentos únicos no se borran y los servicios y categorías van protegidos. */
export function acciones(
  previas: DocumentActionComponent[],
  {schemaType}: DocumentActionsContext,
  unicos: string[],
): DocumentActionComponent[] {
  if (unicos.includes(schemaType))
    return previas.filter(
      ({action}) => !['unpublish', 'delete', 'duplicate'].includes(action ?? ''),
    )
  if (schemaType === 'servicio' || schemaType === 'categoria')
    return previas.map((accion) =>
      ACCIONES_PROTEGIDAS.includes(accion.action ?? '') ? proteger(accion) : accion,
    )
  return previas
}
