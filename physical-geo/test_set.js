let metadata;
let questions;
let startTime;
const userAnswers = {};

// Toggle mobile nav drawer
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-nav');
  const navBox = document.querySelector('.nav-box');
  toggleBtn.addEventListener('click', () => {
    navBox.classList.toggle('open');
  });
  // Prev/Next buttons
  document.getElementById('prev-q').addEventListener('click', () => scrollToQuestion(-1));
  document.getElementById('next-q').addEventListener('click', () => scrollToQuestion(1));
});

function scrollToQuestion(offset) {
  const allQs = document.querySelectorAll('#quiz-container fieldset');
  const visible = Array.from(allQs).findIndex(fs => fs.getBoundingClientRect().top >= 0);
  let idx = visible + offset;
  if (idx < 0) idx = 0;
  if (idx >= allQs.length) idx = allQs.length - 1;
  allQs[idx].scrollIntoView({ behavior: 'smooth' });
}

// Load metadata and update header
fetch('metadata.json')
  .then(res => res.json())
  .then(data => {
    metadata = data;
    document.getElementById('subject-name').innerText = `Self Test Module – ${data.subject_name}`;
    // create topic heading
    const topic = document.createElement('h2');
    topic.id = 'topic-name';
    topic.textContent = data.test_topic;
    document.querySelector('.instructions-container').insertAdjacentElement('afterend', topic);
  })
  .catch(err => console.error('Error loading metadata:', err));

// Start test on button click
document.getElementById('start-test').addEventListener('click', () => {
  startTime = Date.now();
  document.getElementById('start-test').disabled = true;
  document.getElementById('submit').disabled = false;
  fetch('test_data.json')
    .then(res => res.json())
    .then(data => {
      questions = data;
      buildQuiz();
      buildNav();
    })
    .catch(err => console.error('Error loading questions:', err));
});

function buildQuiz() {
  const container = document.getElementById('quiz-container');
  questions.forEach((q, i) => {
    const fs = document.createElement('fieldset');
    fs.id = `question-${i}`;
    fs.innerHTML = `<legend>Question ${i+1}</legend><p>${q.text}</p>`;
    q.options.forEach(opt => {
      const label = document.createElement('label');
      label.innerHTML = `
        <input type="radio" name="q${i}" value="${opt}"> ${opt} <br>
      `;
      fs.appendChild(label);
    });
    container.appendChild(fs);
  });
  container.addEventListener('change', e => {
    if (e.target.name.startsWith('q')) {
      const idx = parseInt(e.target.name.slice(1), 10);
      userAnswers[idx] = e.target.value;
      document.querySelectorAll('#nav-items .nav-question')[idx].classList.add('attempted');
    }
  });
}

function buildNav() {
  const nav = document.getElementById('nav-items');
  for (let i = 0; i < metadata.total_questions; i++) {
    const span = document.createElement('span');
    span.className = 'nav-question';
    span.innerText = i+1;
    span.addEventListener('click', () => {
      document.getElementById(`question-${i}`).scrollIntoView({ behavior: 'smooth' });
    });
    nav.appendChild(span);
  }
}