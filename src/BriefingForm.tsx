import React, { useState } from 'react';
import { useForm } from '@formspree/react';
import './briefing-form.css'

interface ColorPicker {
    color: string;
    name: string;
}

interface Reference {
    url: string;
    description: string;
}

interface FormElements extends HTMLFormControlsCollection {
    company: HTMLInputElement;
    contact: HTMLInputElement;
    email: HTMLInputElement;
    current_url: HTMLInputElement;
    objectives: HTMLTextAreaElement;
    target: HTMLTextAreaElement;
}

interface BriefingFormElement extends HTMLFormElement {
    readonly elements: FormElements;
}

export default function BriefingForm() {
    const [state, handleSubmit] = useForm(process.env.REACT_APP_FORMSPREE_ID || "");
    const [colorPickers, setColorPickers] = useState<ColorPicker[]>([{ color: '#000000', name: '' }]);
    const [references, setReferences] = useState<Reference[]>([{ url: '', description: '' }]);
    const [sections, setSections] = useState<string[]>(['']);
    const [timelines, setTimelines] = useState<string[]>(['']);
    const [functionalities, setFunctionalities] = useState<string[]>(['']);

    const addColorPicker = () => {
        setColorPickers([...colorPickers, { color: '#000000', name: '' }]);
    };

    const updateColorPicker = (index: number, field: keyof ColorPicker, value: string) => {
        const newColorPickers = [...colorPickers];
        newColorPickers[index][field] = value;
        setColorPickers(newColorPickers);
    };

    const removeColorPicker = (index: number) => {
        setColorPickers(colorPickers.filter((_, i) => i !== index));
    };

    const addReference = () => {
        setReferences([...references, { url: '', description: '' }]);
    };

    const updateReference = (index: number, field: keyof Reference, value: string) => {
        const newReferences = [...references];
        newReferences[index][field] = value;
        setReferences(newReferences);
    };

    const removeReference = (index: number) => {
        setReferences(references.filter((_, i) => i !== index));
    };

    const addItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(prev => [...prev, '']);
    };

    const updateItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
        setter(prev => {
            const newItems = [...prev];
            newItems[index] = value;
            return newItems;
        });
    };

    const removeItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
        setter(prev => prev.filter((_, i) => i !== index));
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const form = e.currentTarget as BriefingFormElement;
        
        // Función para formatear los arrays como lista HTML
        const formatArrayToHTML = (arr: string[], title: string) => {
            if (arr.length === 0) return '';
            const items = arr.map(item => `  • ${item}`).join('\n');
            return `\n**${title}:**\n${items}\n`;
        };

        // Función para formatear las referencias
        const formatReferences = (refs: Reference[]) => {
            if (refs.length === 0) return '';
            const items = refs
                .filter(ref => ref.url || ref.description)
                .map(ref => `  • URL: ${ref.url}\n    Descripción: ${ref.description}`)
                .join('\n');
            return `\n**Referencias visuales:**\n${items}\n`;
        };

        // Función para formatear los colores
        const formatColors = (colors: ColorPicker[]) => {
            if (colors.length === 0) return '';
            const items = colors
                .filter(color => color.color !== '#000000' || color.name)
                .map(color => `  • ${color.name || 'Sin nombre'}: ${color.color}`)
                .join('\n');
            return `\n**Colores corporativos:**\n${items}\n`;
        };

        // Añadir campos dinámicos como inputs hidden
        const addHiddenInput = (name: string, value: string) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
        };

        // Formatear y añadir los campos con títulos en español
        addHiddenInput('_format', 'plain');
        addHiddenInput('Información del Formulario', 
            `**Información de Contacto:**
Empresa: ${form.elements.company.value}
Persona de contacto: ${form.elements.contact.value}
Email: ${form.elements.email.value}
URL actual: ${form.elements.current_url.value}
${formatColors(colorPickers)}
${formatReferences(references)}
${formatArrayToHTML(sections.filter(Boolean), 'Secciones de la web')}
${formatArrayToHTML(timelines.filter(Boolean), 'Plazos')}
${formatArrayToHTML(functionalities.filter(Boolean), 'Funcionalidades requeridas')}

**Objetivos del rediseño:**
${form.elements.objectives.value}

**Público objetivo:**
${form.elements.target.value}`
        );

        // Log para debugging
        console.log('Sending data:', Object.fromEntries(new FormData(form)));

        // Enviar el formulario
        handleSubmit(e);

        // Limpiar los inputs hidden después del envío
        setTimeout(() => {
            form.querySelectorAll('input[type="hidden"]').forEach(el => el.remove());
        }, 100);
    };

    if (state.succeeded) {
        return <p>¡Gracias por enviar tu briefing!</p>;
    }

    return (
        <div className="container">
            <h1>Briefing de Rediseño Web</h1>
            <p className="intro-text">Complete este formulario para ayudarnos a entender mejor sus necesidades de rediseño web.</p>

            <form onSubmit={handleFormSubmit}>
                {/* El resto del JSX permanece igual */}
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
                            <div className="color-preview" style={{ backgroundColor: picker.color }}></div>
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
                                name={`section-${index}`}
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
                                name={`timeline-${index}`}
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
                                name={`functionality-${index}`}
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
    );
}