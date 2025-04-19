
// Variabler
let courseCode = document.getElementById('course-code') as HTMLInputElement;
let courseName = document.getElementById('course-name') as HTMLInputElement;
let progression = document.getElementById('progression')as HTMLInputElement;
let courseLink = document.getElementById('link') as HTMLInputElement;
let addBtn = document.getElementById('add-course') as HTMLButtonElement;
let removeBtn = document.getElementById('remove-btn') as HTMLButtonElement;
let tableEl = document.getElementById('course-table') as HTMLTableElement;
let tableBody = document.querySelector('#course-table tbody') as HTMLTableSectionElement;
let removeMarkedBtn = document.getElementById('remove-marked') as HTMLButtonElement;

let codeHeader = document.getElementById('code-header') as HTMLTableCellElement;
let nameHeader = document.getElementById('name-header') as HTMLTableCellElement;
let progressHeader = document.getElementById('progress-header') as HTMLTableCellElement;

codeHeader.addEventListener('click', orderByCode);
nameHeader.addEventListener('click', orderByName);
progressHeader.addEventListener('click', orderByProgress);

// Interface för kursinfo
interface CourseInfo {
  code: string;
  name: string;
  progress: string;
  syllabus: string;
}

// Töm array
let courses: CourseInfo[] = [];


// Eventlyssnare vid sida start/omladdning
window.onload = init; 

// Funktion vid sida start/omladdning
function init() {

  addBtn.disabled = true;
  // Hämta sparada data från localstorage
  courses = JSON.parse(localStorage.getItem('courses')|| '[]');

  
  // Loopa genom den hämtade arrayen för att spara inmatning vid sidans start/omladdning
  courses.forEach((course: CourseInfo) => {
    addCourse(course);
  });
  
};


// Radera alla kurser
removeBtn?.addEventListener('click', removeAllCourses);

function removeAllCourses() {

  while(tableBody.hasChildNodes()) {
    localStorage.clear();
    tableBody.removeChild(tableBody.lastChild as Node);
  };

};

// Funktion som hanterar en interface, skapa tabel för inmatade data, samt spara i local storage
function addCourse(course: CourseInfo): void { 
    
  if(course.code != undefined || course.code != null || course.name != undefined || course.name != null ||
    course.progress != undefined || course.progress != null ||
    course.syllabus != undefined || course.syllabus != null 
  ){
  
  let dataRow: HTMLTableRowElement = document.createElement('tr');
  dataRow.setAttribute('id', course.code);
  // kod-output
  let codeData: HTMLTableCellElement = document.createElement('td');
  let codeOutput = document.createTextNode(course.code);
  codeData.appendChild(codeOutput);
  
  // namn-output
  let nameData: HTMLTableCellElement = document.createElement('td');
  let nameOutput = document.createTextNode(course.name);
  nameData.appendChild(nameOutput);

  // Progression-output
  let progressData: HTMLTableCellElement = document.createElement('td');
  let progressOutput = document.createTextNode(course.progress);
  progressData.appendChild(progressOutput);

  // Länk-output
  let linkData: HTMLTableCellElement = document.createElement('td');
  let courseLink: HTMLAnchorElement = document.createElement('a');
  courseLink.setAttribute('href', course.syllabus);
  courseLink.setAttribute('target', '_blank');
  let linkOutput = document.createTextNode('Kursplan');
  courseLink.appendChild(linkOutput);
  linkData.appendChild(courseLink);
  
  // Checkbox
  let checkBox: HTMLInputElement = document.createElement('input');
  let checkData: HTMLTableCellElement = document.createElement('td');
  checkData.appendChild(checkBox);
  checkBox.setAttribute('type', 'checkbox');
  checkBox.addEventListener('change', () => {
    
    // Kontrollera om checkbox är kryssad eller inte
    if(checkBox.checked){
      // Ta bort index om checkbox är kryssad
      let index = courses.findIndex(row => row.code === dataRow.id);
      courses.splice(index, 1);
    } else {
      
      courses.push(course);
    }
    
    // Spara nya arrayen till localStorage
    localStorage.setItem('markedRows', JSON.stringify(courses));
  });

  // Lägg till kurs detaljer i tabellsrad
  dataRow.appendChild(codeData);
  dataRow.appendChild(nameData);
  dataRow.appendChild(progressData);
  dataRow.appendChild(linkData);
  dataRow.appendChild(checkData);

  // Lägg till rad i tabellen
  tableBody.appendChild(dataRow);
  tableEl.appendChild(tableBody);
  }
};


// Eventlyssnare och funktion för att radera markerade kurser
removeMarkedBtn?.addEventListener('click', removeMarked);

function removeMarked() {
  let markedRows = JSON.parse(localStorage.getItem('markedRows') || '[]');
  
  tableBody.innerHTML = '';
  markedRows.forEach((markedCourse: CourseInfo) => {
    addCourse(markedCourse);
  });
  
  // Uppdatera sparade kurser i Local storage
  localStorage.removeItem('courses');
  localStorage.setItem('courses', JSON.stringify(markedRows));
}



// Eventlyssnare för att kontrollera inmatningsfält samt aktivera eller inaktivera lägg till knapp
courseCode.addEventListener('keyup', canAdd);
courseName.addEventListener('keyup', canAdd);
progression.addEventListener('keyup', canAdd);
courseLink.addEventListener('keyup', canAdd);

function canAdd() {
  if(courseCode.value.length > 0 && courseName.value.length > 0 && progression.value.length > 0 && courseLink.value.length > 0) {
    addBtn.disabled = false;
  } else {
    addBtn.disabled = true;
  }
}
// Eventlyssnare för lägg till-knapp
addBtn.addEventListener('click', saveCourse);

// Funktion som lägger till inmatade kurs information i tabellen
function saveCourse() {
  
  
  let newCourseInfo: CourseInfo = {
    code: courseCode.value,
    name: courseName.value,
    progress: progression.value,
    syllabus:  courseLink.value
  };


  // If-sats för att kontrollera att kurskod är unik och inte finns, samt att progression är begränsat till A, B, C
  if(courses.every(newCourse => newCourse.code.toLowerCase() !== newCourseInfo.code.toLowerCase()) && (newCourseInfo.progress === 'A' || newCourseInfo.progress === 'B' || newCourseInfo.progress === 'C')) {
  addCourse(newCourseInfo);
  courses.push(newCourseInfo);
  }

  // Spara till localstorage
  localStorage.setItem('courses', JSON.stringify(courses));
  
  // Töm inmatningsfält
  courseCode.value = '';
  courseName.value = '';
  progression.value = '';
  courseLink.value = '';

  
};



// Funktion som organiserar kursinfo enligt kurskod
function orderByCode() {
  
  

  let dataOrder = codeHeader.getAttribute('data-order');
  if(dataOrder === 'desc') {
    codeHeader.setAttribute('data-order', 'asc');
    courses.sort((a: CourseInfo, b: CourseInfo) => {
      return (a.code > b.code) ? 1:-1;
    });
  } else if(dataOrder === 'asc') {
    codeHeader.setAttribute('data-order', 'desc');
    courses.sort((a: CourseInfo, b: CourseInfo) => {
      return (b.code > a.code) ? 1:-1;
    });
  }
  tableBody.innerHTML = '';
  courses.forEach(course => {
      addCourse(course);
    });
  
};

// Funktion som organiserar kursinfo enligt kursnamn
function orderByName() {

  let dataOrder = nameHeader.getAttribute('data-order');
  if(dataOrder === 'desc') {
    nameHeader.setAttribute('data-order', 'asc');
    courses.sort((a: CourseInfo, b: CourseInfo) => {
      return (a.name > b.name) ? 1:-1;
    });
    
  } else if(dataOrder === 'asc') {
    nameHeader.setAttribute('data-order', 'desc');
    courses.sort((a: CourseInfo, b: CourseInfo) => {
      return (b.name > a.name) ? 1:-1;
    });
  }
  tableBody.innerHTML = '';
  courses.forEach(course => {
      addCourse(course);
    });
};

// Funktion som organiserar kursinfo enligt kurs progression
function orderByProgress() {

  let dataOrder = progressHeader.getAttribute('data-order');
  if(dataOrder === 'desc') {
    progressHeader.setAttribute('data-order', 'asc');
    courses.sort((a: CourseInfo, b: CourseInfo) => {
      return (a.progress > b.progress) ? 1:-1;
    });
    
  } else if(dataOrder === 'asc') {
    progressHeader.setAttribute('data-order', 'desc');
    courses.sort((a: CourseInfo, b: CourseInfo) => {
      return (b.progress > a.progress) ? 1:-1;
    });
  }
  tableBody.innerHTML = '';
  courses.forEach(course => {
      addCourse(course);
    });
};