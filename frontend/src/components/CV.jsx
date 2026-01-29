import React, { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import "./cv.css";

export default function CV() {
  const { data, loading, error } = useFetch("/experiencia");
  const [loaded, setLoaded] = useState(false);

  if (loading) return <p style={{ textAlign: "center" }}>Cargando hoja de vida...</p>;
  if (error) return <p style={{ textAlign: "center" }}>Error al cargar datos</p>;
  if (!data || data.length === 0) return <p>No hay información disponible</p>;

  const perfil = data[0];

  return (
    <div className={`cv-wrapper ${loaded ? "loaded" : ""}`}>
      {/* ENCABEZADO */}
      <header className="cv-header">
        <h1 className="cv-name-main">
          {perfil.nombre}
        </h1>
        <div className="cv-contact-top">
          <span>✉️ {perfil.email}</span>
          <span className="dot">•</span>
          <span>📱 {perfil.telefono}</span>
          <span className="dot">•</span>
          <span>📍 {perfil.direccion}</span>
        </div>
      </header>

      {/* TARJETA PRINCIPAL */}
      <div className="cv-card">
        {/* COLUMNA IZQUIERDA */}
        <aside className="cv-left">
          <div className="photo-wrap">
            <img src="/foto_cv.jpg" alt="Foto CV" className="cv-photo" />
          </div>

          <section className="section contact">
            <h3 className="section-title">Contacto</h3>
            <p className="muted-line">✉️ {perfil.email}</p>
            <p className="muted-line">📱 {perfil.telefono}</p>
            <p className="muted-line">📍 {perfil.direccion}</p>
          </section>

          <div className="separator" />

          <section className="section education">
            <h3 className="section-title">🎓 Formación académica</h3>
            <ul className="muted">
              {perfil.estudios.map((est, i) => (
                <li key={i}>{est}</li>
              ))}
            </ul>
          </section>

          <div className="separator" />

          <section className="section skills">
            <h3 className="section-title">🛠 Aptitudes técnicas</h3>

            {perfil.habilidades.map((hab, i) => (
              <div className="skill-row" key={i}>
                <div className="skill-label">{hab.nombre}</div>

                <div className="skill-bar">
                  <div
                    className="skill-fill"
                    style={{ width: loaded ? hab.nivel + "%" : "0%" }}
                  />
                </div>

                <div className="skill-percent">{hab.nivel}%</div>
              </div>
            ))}
          </section>
        </aside>

        {/* COLUMNA DERECHA */}
        <main className="cv-right">
          <section className="section profile">
            <h2 className="section-title-big">💼 Perfil profesional</h2>
            <p className="lead">{perfil.resumen}</p>
          </section>

          <div className="separator thin" />

          <section className="section projects">
            <h2 className="section-title-big">📁 Experiencia / Proyectos</h2>

            {perfil.experienciaLaboral.map((exp, i) => (
              <article className="project" key={i}>
                <h4 className="project-title">{exp.titulo}</h4>
                <p className="muted">{exp.descripcion}</p>
              </article>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
