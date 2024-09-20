import React, { useState, useEffect } from "react";

function FraseDelDia() {
  const [frase, setFrase] = useState(null);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Obtener la fecha en formato YYYY-MM-DD
    const storedFrase = JSON.parse(localStorage.getItem("fraseDelDia"));

    // Verificar si ya hay una frase almacenada para el día actual
    if (storedFrase && storedFrase.fecha === today) {
      setFrase(storedFrase.frase);
    } else {
      // Si no hay frase almacenada para hoy, seleccionar una nueva
      fetch("/frases.json")
        .then((response) => response.json())
        .then((data) => {
          const frasesInspiracion = data.filter(
            (item) => item.clasificacion === "inspiracion"
          );
          const frasesReflexion = data.filter(
            (item) => item.clasificacion === "reflexion"
          );

          // Seleccionar una frase según el día de la semana
          const diaSemana = new Date().getDay(); // 0 = domingo, 6 = sábado
          let frasesDelDia;

          if (diaSemana >= 1 && diaSemana <= 3) {
            frasesDelDia = frasesInspiracion; // Lunes, martes y miércoles
          } else {
            frasesDelDia = frasesReflexion; // Jueves, viernes, sábado y domingo
          }

          const randomFrase =
            frasesDelDia[Math.floor(Math.random() * frasesDelDia.length)];

          setFrase(randomFrase);

          // Guardar la frase en localStorage con la fecha
          localStorage.setItem(
            "fraseDelDia",
            JSON.stringify({ frase: randomFrase, fecha: today })
          );
        });
    }

    // Aplicar estilos globales cuando se monta el componente
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.height = "100vh";
    document.documentElement.style.height = "100vh";

    return () => {
      // Limpiar estilos globales cuando se desmonte el componente
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.height = "";
      document.documentElement.style.height = "";
    };
  }, []);

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      position: "relative",
      backgroundImage: "url('/cielonoche.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1,
    },
    content: {
      position: "relative",
      zIndex: 2,
      color: "#fff",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%",
    },
    frase: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      margin: "0 auto",
      maxWidth: "80%",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
    },
    autor: {
      fontSize: "1.5rem",
      marginTop: "10px", // Espacio entre la frase y el autor
      fontStyle: "italic",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <div style={styles.content}>
        {frase ? (
          <>
            <h1 style={styles.frase}>“{frase.frase}”</h1>
            <p style={styles.autor}>- {frase.autor}</p>
          </>
        ) : (
          <p>Cargando frase...</p>
        )}
      </div>
    </div>
  );
}

export default FraseDelDia;
