(function () {
  let button = document.getElementById("btn");

  let form = document.querySelector("#validate-form");
  let fields = form.querySelectorAll(".form-control");
  let errorsCount = [];
  let dateInput = form.querySelector("#inputDOB");
  let startyearInput = form.querySelector("#inputStartYear");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    removeValidation();

    checkFieldsPresence();

    checkDateRange();

    checkStartyearRange();
  });

  let generateError = function (text) {
    let error = document.createElement("div");
    error.className = "error";
    error.style.color = "red";
    error.innerHTML = text;
    return error;
  };

  let removeValidation = function () {
    let errors = form.querySelectorAll(".error");

    for (let i = 0; i < errors.length; i++) {
      errors[i].remove();
    }
  };

  let checkFieldsPresence = function () {
    for (let i = 0; i < fields.length; i++) {
      if (!fields[i].value.trim()) {
        let error = generateError("Запоните поле!");
        form[i].parentElement.insertBefore(error, fields[i]);
        errorsCount.push(error);
      }
    }

    if (!errorsCount.length) {
      addStudent();

      document.getElementById("inputFirstName").value = null;
      document.getElementById("inputSecondName").value = null;
      document.getElementById("inputMiddleName").value = null;
      document.getElementById("inputDOB").value = null;
      document.getElementById("inputStartYear").value = null;
      document.getElementById("inputFaculty").value = null;
    } else {
      let errorFull = generateError("Сверьтесь с комментариями над полями!");
      button.before(errorFull);
    }
  };

  let checkDateRange = function () {
    if (
      Date.parse(dateInput.value) < Date.parse("1900-01-01") ||
      Date.parse(dateInput.value) > Date.now()
    ) {
      let error = generateError("Не соответствует диапазону!");
      dateInput.before(error);
    }
  };

  let checkStartyearRange = function () {
    let today = new Date();
    if (
      (Number(startyearInput.value) < 2000 ||
        Number(startyearInput.value) > Number(today.getFullYear())) &&
      startyearInput.value
    ) {
      let error = generateError("Не соответствует диапазону!");
      startyearInput.before(error);
    }

    if (
      Math.floor(
        Date.parse(startyearInput.value) - Date.parse(dateInput.value)
      ) /
        (1000 * 60 * 60 * 24 * 365) <
      17
    ) {
      let error = generateError(
        "Некорректный год начала обучения, возраст не соответствует!"
      );
      startyearInput.before(error);
    }
  };

  let students = [];

  function addStudent() {
    let firstname = document.getElementById("inputFirstName");
    let secondname = document.getElementById("inputSecondName");
    let middlename = document.getElementById("inputMiddleName");
    let dob = document.getElementById("inputDOB");
    let startyear = document.getElementById("inputStartYear");
    let faculty = document.getElementById("inputFaculty");

    let student = {
      firstname: firstname.value,
      secondname: secondname.value,
      middlename: middlename.value,
      dob: new Date(dob.value.split("-").map(Number)),
      startyear: startyear.value,
      faculty: faculty.value,
    };

    students.push(student);

    addRow(student);
  }

  function addRow(student) {
    let template = document.getElementById("studentrow");
    let tbody = document.getElementById("students");

    let clone = template.content.cloneNode(true);

    let tableIndex = clone.getElementById("index");
    let tableFullname = clone.getElementById("fullname");
    let tableFaculty = clone.getElementById("faculty");
    let tableAge = clone.getElementById("age");
    let tableLearning = clone.getElementById("learning");

    tableIndex.textContent = students.indexOf(student) + 1;
    tableFullname.textContent = `${student.secondname} ${student.firstname[0]}. ${student.middlename[0]}.`;
    tableFaculty.textContent = student.faculty;
    tableAge.textContent = `${student.dob.getDate()}.${
      student.dob.getMonth() + 1
    }.${student.dob.getFullYear()} (${Math.floor(
      (Date.now() - student.dob) / (1000 * 60 * 60 * 24 * 365)
    )} лет)`;
    let currentDate = new Date(student.startyear);
    tableLearning.textContent =
      Date.now() < Date.parse(+student.startyear + 6)
        ? `${student.startyear}-${+student.startyear + 6} (${Math.floor(
            (Date.now() - currentDate) / (1000 * 60 * 60 * 24 * 365)
          )} курс)`
        : `${student.startyear}-${+student.startyear + 6} (закончил)`;

    tbody.appendChild(clone);
  }

  function fillTable() {
    document.getElementById("students").innerHTML = "";

    students.forEach((student) => addRow(student));
  }

  function sortByName() {
    students.sort(function (a, b) {
      let aFullName = `${a.secondname} ${a.firstname}. ${a.middlename}`;
      let bFullName = `${b.secondname} ${b.firstname}. ${b.middlename}`;

      return aFullName > bFullName ? 1 : -1;
    });

    fillTable();
  }

  document.querySelector("#sortFSM").addEventListener("click", sortByName);
})();
