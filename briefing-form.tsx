import React, { useState } from 'react'
import { useForm } from '@formspree/react'
import './briefing-form.css'

export default function BriefingForm() {
  const [state, handleSubmit] = useForm("YOUR_FORMSPREE_FORM_ID")
  const [colorPickers, setColorPickers] = useState([{ color: '#000000', name: '' }])
  const [references, setReferences] = useState([{ url: '', description: '' }])
  const [sections, setSections] = useState([''])
  const [timelines, setTimelines] = useState([''])
  const [functionalities, setFunctionalities] = useState([''])

  const addColorPicker = () => {
    setColorPickers([...colorPickers, { color: '#000000', name: '' }])
  }

  const updateColorPicker = (index, field, value) => {
    const newColorPickers = [...colorPickers]
    newColorPickers[index][field] = value
    setColorPickers(newColorPickers)
  }

  const removeColorPicker = (index) => {
    setColorPickers(colorPickers.filter((_, i) => i !== index))
  }

  const addReference = () => {
    setReferences([...references, { url: '', description: '' }])
  }

  const updateReference = (index, field, value) => {
    const newReferences = [...references]
    newReferences[index][field] = value
    setReferences(newReferences)
  }

  const removeReference = (index) => {
    setReferences(references.filter((_, i) => i !== index))
  }

  const addItem = (setter) => {
    setter(prev => [...prev, ''])
  }

  const updateItem = (setter, index, value) => {
    setter(prev => {
      const newItems = [...prev]
      newItems[index] = value
      return newItems
    })
  }

  const removeItem = (setter, index) => {
    setter(prev => prev.filter((_, i) => i !== index))
  }

  if (state.succeeded) {
    return <p>¡Gracias por enviar tu briefing!</p>
  }

  return (
    <div className="container">
      <h1>Briefing de Rediseño Web</h1>
      <p className="intro-text">Complete este formulario para ayudarnos a entender mejor sus necesidades de rediseño web.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="section-title">Información de contacto</div>
        <div className="grid">
          <div className="form-group">
            <label htmlFor="company">Empresa *</label>
            <input type="text" id="company" name="company" required />
          </div>
          <div className="form-group">
            <label htmlFor="contact">Persona de contacto *</label>
            <input type="text" id="contact" name="contact" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input type="email" id="email" name="email" required />
          </div>
        </div>

        <div className="section-title">Sitio web actual</div>
        <div className="form-group">
          <label htmlFor="current_url">URL actual</label>
          <input type="url" id="current_url" name="current_url" />
        </div>

        <div className="section-title">Referencias visuales</div>
        <div className="form-group">
          <label>Sitios web de referencia</label>
          {references.map((ref, index) => (
            <div key={index} className="reference-item">
              <input
                type="url"
                placeholder="URL del sitio web de referencia"
                value={ref.url}
                onChange={(e) => updateReference(index, 'url', e.target.value)}
              />
              <input
                type="text"
                placeholder="¿Qué te gusta de este sitio?"
                value={ref.description}
                onChange={(e) => updateReference(index, 'description', e.target.value)}
              />
              <button type="button" className="secondary" onClick={() => removeReference(index)}>Eliminar</button>
            </div>
          ))}
          <button type="button" className="secondary" onClick={addReference}>Añadir otra referencia</button>
        </div>

        <div className="section-title">Identidad visual</div>
        <div className="form-group">
          <label>Colores corporativos</label>
          {colorPickers.map((picker, index) => (
            <div key={index} className="color-picker">
              <input
                type="color"
                value={picker.color}
                onChange={(e) => updateColorPicker(index, 'color', e.target.value)}
              />
              <div className="color-preview" style={{backgroundColor: picker.color}}></div>
              <input
                type="text"
                placeholder="Nombre/descripción del color"
                value={picker.name}
                onChange={(e) => updateColorPicker(index, 'name', e.target.value)}
              />
              <button type="button" className="secondary" onClick={() => removeColorPicker(index)}>Eliminar</button>
            </div>
          ))}
          <button type="button" className="secondary" onClick={addColorPicker}>Añadir color</button>
        </div>

        <div className="section-title">Secciones de la web</div>
        <div className="form-group">
          {sections.map((section, index) => (
            <div key={index} className="reference-item">
              <input
                type="text"
                placeholder="Nombre de la sección"
                value={section}
                onChange={(e) => updateItem(setSections, index, e.target.value)}
              />
              <button type="button" className="secondary" onClick={() => removeItem(setSections, index)}>Eliminar</button>
            </div>
          ))}
          <button type="button" className="secondary" onClick={() => addItem(setSections)}>Añadir sección</button>
        </div>

        <div className="section-title">Plazos</div>
        <div className="form-group">
          {timelines.map((timeline, index) => (
            <div key={index} className="reference-item">
              <input
                type="text"
                placeholder="Descripción del plazo"
                value={timeline}
                onChange={(e) => updateItem(setTimelines, index, e.target.value)}
              />
              <button type="button" className="secondary" onClick={() => removeItem(setTimelines, index)}>Eliminar</button>
            </div>
          ))}
          <button type="button" className="secondary" onClick={() => addItem(setTimelines)}>Añadir plazo</button>
        </div>

        <div className="section-title">Funcionalidades requeridas</div>
        <div className="form-group">
          {functionalities.map((functionality, index) => (
            <div key={index} className="reference-item">
              <input
                type="text"
                placeholder="Descripción de la funcionalidad"
                value={functionality}
                onChange={(e) => updateItem(setFunctionalities, index, e.target.value)}
              />
              <button type="button" className="secondary" onClick={() => removeItem(setFunctionalities, index)}>Eliminar</button>
            </div>
          ))}
          <button type="button" className="secondary" onClick={() => addItem(setFunctionalities)}>Añadir funcionalidad</button>
        </div>

        <div className="section-title">Objetivos del rediseño</div>
        <div className="form-group">
          <label htmlFor="objectives">Objetivos principales *</label>
          <textarea id="objectives" name="objectives" rows={4} required></textarea>
          <p className="helper-text">Ejemplos: mejorar conversiones, modernizar diseño, optimizar usabilidad...</p>
        </div>

        <div className="form-group">
          <label htmlFor="target">Público objetivo *</label>
          <textarea id="target" name="target" rows={3} required></textarea>
        </div>

        <button type="submit" disabled={state.submitting}>
          {state.submitting ? 'Enviando...' : 'Enviar briefing'}
        </button>
      </form>
    </div>
  )
}