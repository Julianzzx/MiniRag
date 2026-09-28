# MiniRAG Académico

Asistente inteligente desarrollado con **Spring Boot + Spring AI + RAG** que responde
preguntas usando como contexto documentos académicos (`.txt`) sobre Spring Boot,
Microservicios y Spring AI.

## Requisitos

- Java 21
- Maven 3.9+
- Una API Key de [GroqCloud](https://console.groq.com)

## 1. Configurar la API Key de Groq

Nunca guardes la clave en el repositorio. Defínela como variable de entorno.

**Linux / macOS:**
```bash
export GROQ_API_KEY="gsk_xxxxxxxxxxxxxxxxx"
```

**Windows PowerShell:**
```powershell
$env:GROQ_API_KEY="gsk_xxxxxxxxxxxxxxxxx"
```

En IntelliJ IDEA: `Run` → `Edit Configurations` → `Environment Variables` → `GROQ_API_KEY=su_clave`.

## 2. Compilar

```bash
mvn clean compile
```

## 3. Ejecutar

```bash
mvn spring-boot:run
```

En la primera ejecución, el modelo de embeddings (E5-small ONNX) se descarga y
se guarda en caché local, por lo que puede tardar un poco más.

## 4. Usar la aplicación

Abre en el navegador:

```
http://localhost:8080
```

Escribe una pregunta o usa uno de los botones de ejemplo. La respuesta se genera
con contexto recuperado (RAG) de los archivos en `src/main/resources/documentos/`.

## Endpoints REST

| Método | Endpoint         | Descripción                      |
|--------|------------------|-----------------------------------|
| GET    | `/api/salud`     | Verifica que la aplicación esté activa |
| POST   | `/api/chat`      | Envía una pregunta (`{"pregunta": "..."}`) |
| GET    | `/api/consultas` | Devuelve el historial de preguntas/respuestas |

También puedes usar el archivo `pruebas.http` con el cliente HTTP de IntelliJ.

## Consola H2

```
http://localhost:8080/h2-console
```

- JDBC URL: `jdbc:h2:file:./data/miniragdb`
- Usuario: `sa`
- Contraseña: (vacía)

## Arquitectura

```
Frontend (HTML/CSS/JS)
        │  POST /api/chat
        ▼
   ChatController
        │
        ▼
    ChatService ──► H2 (historial)
        │
        ▼
QuestionAnswerAdvisor
        │
   ┌────┴─────┐
   ▼          ▼
VectorStore   Groq (GPT-OSS-20B)
   │
   ▼
Fragmentos relevantes
        │
        ▼
   RESPUESTA RAG
```

## Estructura del proyecto

```
minirag
├── pom.xml
├── pruebas.http
└── src
    ├── main
    │   ├── java/com/tecnologico/minirag
    │   │   ├── MiniragApplication.java
    │   │   ├── config/AiConfig.java
    │   │   ├── controller/ChatController.java
    │   │   ├── service/ChatService.java
    │   │   ├── service/DocumentService.java
    │   │   ├── model/Consulta.java
    │   │   └── repository/ConsultaRepository.java
    │   └── resources
    │       ├── application.properties
    │       ├── documentos/ (springboot.txt, microservicios.txt, springai.txt)
    │       └── static/ (index.html, styles.css, app.js)
    └── test/java/com/tecnologico/minirag/MiniragApplicationTests.java
```

