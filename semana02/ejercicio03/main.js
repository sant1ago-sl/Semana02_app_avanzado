const http = require("http");
const repo = require("./repository/studentsRepository");

const PORT = 4000;

function parseBody(req, callback) {
  let body = "";
  req.on("data", chunk => (body += chunk));
  req.on("end", () => {
    try {
      const data = JSON.parse(body || "{}");
      callback(null, data);
    } catch (error) {
      callback(new Error("JSON inválido"));
    }
  });
}

function getQueryParam(url, key) {
  const queryString = url.split("?")[1] || "";
  const params = new URLSearchParams(queryString);
  return params.get(key);
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  const { method, url } = req;

  // RUTA: GET /students
  if (url === "/students" && method === "GET") {
    return sendJson(res, 200, repo.getAll());
  }

  // RUTA: GET /students/:id
  if (url.startsWith("/students/") && method === "GET") {
    const id = parseInt(url.split("/")[2]);
    const student = repo.getById(id);

    if (student) return sendJson(res, 200, student);
    return sendJson(res, 404, { error: "Estudiante no encontrado" });
  }

  // RUTA: POST /students
  if (url === "/students" && method === "POST") {
    return parseBody(req, (err, data) => {
      if (err) return sendJson(res, 400, { error: err.message });

      const requiredFields = ["name", "email", "course", "phone"];
      const missing = requiredFields.filter(field => !data[field]);
      if (missing.length) {
        return sendJson(res, 400, { error: `Faltan campos obligatorios: ${missing.join(", ")}` });
      }

      const student = repo.create(data);
      return sendJson(res, 201, student);
    });
  }

  // RUTA: PUT /students/:id
  if (url.startsWith("/students/") && method === "PUT") {
    const id = parseInt(url.split("/")[2]);
    return parseBody(req, (err, data) => {
      if (err) return sendJson(res, 400, { error: err.message });

      const updated = repo.update(id, data);
      if (updated) return sendJson(res, 200, updated);
      return sendJson(res, 404, { error: "Estudiante no encontrado" });
    });
  }

  // RUTA: DELETE /students/:id
  if (url.startsWith("/students/") && method === "DELETE") {
    const id = parseInt(url.split("/")[2]);
    const deleted = repo.remove(id);

    if (deleted) return sendJson(res, 200, deleted);
    return sendJson(res, 404, { error: "Estudiante no encontrado" });
  }

  // RUTA: POST /ListByStatus
  if (url.startsWith("/ListByStatus") && method === "POST") {
    return parseBody(req, (err, data) => {
      if (err) return sendJson(res, 400, { error: err.message });

      const statusBody = data.status;
      const statusQuery = getQueryParam(url, "status");
      const status = (statusBody || statusQuery || "Activo").toString().trim();

      const filtered = repo.getAll().filter(s => (s.status || "").toLowerCase() === status.toLowerCase());
      return sendJson(res, 200, filtered);
    });
  }

  // RUTA: POST /ListByGrade
  if (url.startsWith("/ListByGrade") && method === "POST") {
    return parseBody(req, (err, data) => {
      if (err) return sendJson(res, 400, { error: err.message });

      const minBody = data.minGrade;
      const maxBody = data.maxGrade;
      const minQuery = getQueryParam(url, "minGrade");
      const maxQuery = getQueryParam(url, "maxGrade");

      const minGrade = minBody !== undefined ? Number(minBody) : minQuery !== null ? Number(minQuery) : 0;
      const maxGrade = maxBody !== undefined ? Number(maxBody) : maxQuery !== null ? Number(maxQuery) : Number.POSITIVE_INFINITY;

      if (Number.isNaN(minGrade)) return sendJson(res, 400, { error: "minGrade debe ser un número" });
      if (maxGrade !== Number.POSITIVE_INFINITY && Number.isNaN(maxGrade)) return sendJson(res, 400, { error: "maxGrade debe ser un número" });

      const filtered = repo.getAll().filter(s => {
        const grade = Number(s.grade);
        return !Number.isNaN(grade) && grade >= minGrade && grade <= maxGrade;
      });

      return sendJson(res, 200, filtered);
    });
  }

  // Ruta no encontrada
  return sendJson(res, 404, { error: "Ruta no encontrada" });
});

server.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
