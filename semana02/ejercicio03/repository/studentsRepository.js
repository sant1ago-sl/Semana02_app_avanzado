let students = [
  {
    id: 1,
    name: "Juan Pérez",
    grade: 20,
    age: 23,
    email: "juan.perez@ejemplo.com",
    phone: "+51 987654321",
    enrollmentNumber: "2025001",
    course: "Diseño y Desarrollo de Software C24",
    year: 3,
    subjects: ["Algoritmos", "Bases de Datos", "Redes"],
    gpa: 3.8,
    status: "Activo",
    admissionDate: "2022-03-01"
  },
  {
    id: 2,
    name: "Luis",
    grade: 14,
    age: 22,
    email: "luis@ejemplo.com",
    phone: "+51 912345678",
    enrollmentNumber: "2025002",
    course: "Back-end",
    year: 2,
    subjects: ["Node.js", "SQL"],
    gpa: 3.2,
    status: "Activo",
    admissionDate: "2022-03-01"
  }
];

function getAll() {
  return students;
}

function getById(id) {
  return students.find(s => s.id === id);
}

function create(student) {
  const newId = students.length ? Math.max(...students.map(s => s.id)) + 1 : 1;
  const studentWithId = {
    id: newId,
    name: student.name || "",
    grade: student.grade || 0,
    age: student.age || null,
    email: student.email || "",
    phone: student.phone || "",
    enrollmentNumber: student.enrollmentNumber || "",
    course: student.course || "",
    year: student.year || null,
    subjects: student.subjects || [],
    gpa: student.gpa || null,
    status: student.status || "",
    admissionDate: student.admissionDate || "",
    ...student
  };

  students.push(studentWithId);
  return studentWithId;
}

function update(id, updateData) {
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    students[index] = {
      ...students[index],
      ...updateData,
      id: students[index].id
    };
    return students[index];
  }
  return null;
}

function remove(id) {
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    return students.splice(index, 1)[0];
  }
  return null;
}

module.exports = { getAll, getById, create, update, remove };
