// Evaluate quiz on submission
document.getElementById('submit').addEventListener('click', () => {
  const endTime = Date.now();
  const timeTaken = Math.floor((endTime - startTime) / 1000);
  let correct = 0, wrong = 0, unattempted = 0;

  questions.forEach((q, i) => {
    const userAns = userAnswers[i];
    const fs = document.getElementById(`question-${i}`);
    const navItem = document.querySelectorAll('#nav-items .nav-question')[i];

    if (!userAns) {
      unattempted++;
      //navItem.classList.add('wrong');
    } else if (userAns === q.answer) {
      correct++;
      navItem.classList.add('correct');
    } else {
      wrong++;
      navItem.classList.add('wrong');
    }

    const expl = document.createElement('div');
    expl.className = 'explanation';
    if (userAns === q.answer){
      expl.innerHTML = `<p> <b style="color:green"> Explanation: </b> ${q.explanation} </p>`;
    } else if (!userAns) {
      expl.innerHTML = `<p> <b> Explanation: </b> ${q.explanation} </p>`;
    } else {
      expl.innerHTML = `<p> <b style="color:red"> Explanation: </b> ${q.explanation} </p>`
    }
    fs.appendChild(expl);
  });

  const summary = document.createElement('div');
  const penalty = 0.67; 
  summary.className = 'summary';
  summary.innerHTML = `
    <h3><center>Results</center></h3>
    <p>Score: ${(correct * 2) - (wrong * penalty)}</p>
    <p>Time Taken: ${timeTaken} seconds</p>
    <p>Correct: ${correct} <br> Wrong: ${wrong} <br> Unattempted: ${unattempted}</p>
  `;
  document.querySelector('.controls').after(summary);
  document.getElementById('submit').disabled = true;
});