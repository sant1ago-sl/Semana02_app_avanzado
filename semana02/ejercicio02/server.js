const http = require("http");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const PORT = 3000;

// Registrar helper personalizado para comparaciones
handlebars.registerHelper('gt', (a, b) => a > b);

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  if (req.url === "/") {
    const filePath = path.join(__dirname, "views", "home.hbs");
    fs.readFile(filePath, "utf8", (err, templateData) => {
      if (err) {
        res.statusCode = 500;
        res.end("Error interno del servidor");
        return;
      }

      const template = handlebars.compile(templateData);
      const data = {
        title: "Servidor Handlebars 🚀",
        welcomeMessage: "Bienvenido al laboratorio de Node.js",
        day: new Date().toLocaleDateString("es-PE"),
        students: ["Ana", "Pedro", "María"],
      };

      const html = template(data);
      res.end(html);
    });
  } else if (req.url === "/about") {
    const filePath = path.join(__dirname, "views", "about.hbs");
    fs.readFile(filePath, "utf8", (err, templateData) => {
      if (err) {
        res.statusCode = 500;
        res.end("Error interno del servidor");
        return;
      }

      const template = handlebars.compile(templateData);
      const data = {
        title: "Acerca de la clase",
        course: "Desarrollo Web con Node.js",
        instructor: "Ing. Juan Pérez",
        date: new Date().toLocaleDateString("es-PE"),
        classroom: "Aula 205",
      };

      const html = template(data);
      res.end(html);
    });
  } else if (req.url === "/students") {
    const filePath = path.join(__dirname, "views", "students.hbs");
    fs.readFile(filePath, "utf8", (err, templateData) => {
      if (err) {
        res.statusCode = 500;
        res.end("Error interno del servidor");
        return;
      }

      const template = handlebars.compile(templateData);
      const data = {
        title: "Lista de Estudiantes",
        students: [
          { nombre: "Ana García", nota: 18 },
          { nombre: "Pedro López", nota: 16 },
          { nombre: "María Rodríguez", nota: 14 },
          { nombre: "Carlos Martínez", nota: 17 },
          { nombre: "Laura Sánchez", nota: 13 },
        ],
      };

      const html = template(data);
      res.end(html);
    });
  } else {
    res.statusCode = 404;
    res.end("<h1>404 - Página no encontrada</h1>");
  }
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});