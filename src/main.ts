
// Variabler
let courseCode = document.getElementById('course-code') as HTMLInputElement;
let courseName = document.getElementById('course-name') as HTMLInputElement;
let progression = document.getElementById('progression')as HTMLInputElement;
let courseLink = document.getElementById('link') as HTMLInputElement;
let addBtn = document.getElementById('add-course');


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

  // Hämta sparada data från localstorage
  let savedData = JSON.parse(localStorage.getItem('courses')|| '[]');

  // Loopa genom den hämtade arrayen för att spara inmatning vid sidans start/omladdning
  savedData.forEach((course: CourseInfo) => {
    addCourse(course);
  });
};

// Funktion som hanterar en interface, skapa tabel för inmatade data, samt spara i local storage
function addCourse(course: CourseInfo): void { 
  
  let tableEl = document.getElementById('course-table') as HTMLTableElement;
  
  
  
  courses.push(course);
  localStorage.setItem('courses', JSON.stringify(courses));
  // console.log(courses);
  let codeRow: HTMLTableRowElement = document.createElement('tr');
  
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
  
  codeRow.appendChild(codeData);
  codeRow.appendChild(nameData);
  codeRow.appendChild(progressData);
  codeRow.appendChild(linkData);

  tableEl.appendChild(codeRow);
};

// Eventlyssnare för lägg till-knapp
addBtn?.addEventListener('click', saveCourse);

// Funktion som lägger till inmatade kurs information i tabellen
function saveCourse() {
  let newCourseInfo: CourseInfo = {
    code: courseCode.value,
    name: courseName.value,
    progress: progression.value,
    syllabus:  courseLink.value
  };

  // localStorage.setItem(newCourseInfo, 'courseInfo');
  addCourse(newCourseInfo);
  courseCode.value = '';
  courseName.value = '';
  progression.value = '';
  courseLink.value = '';
}