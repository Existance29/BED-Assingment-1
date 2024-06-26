//Check if user is logged in before loading content
//if user is not logged in, redirect them to login screen
//Dont wait for content to load, redirect asap
if (!isLoggedIn()) location.href = "./login.html"

async function fetchQuizzes() {
    try {
        const response = await fetch('http://localhost:3000/quizzes');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const quizzes = await response.json();
        displayQuizzes(quizzes);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
    }
}

function displayQuizzes(quizzes) {
    const quizList = document.getElementById('quizList');
    quizList.innerHTML = '';
    quizzes.forEach(quiz => {
        const quizDiv = document.createElement('div');
        quizDiv.className = 'quiz';
        quizDiv.innerHTML = `
            <div class="quiz-item row">
                <div class="col-md-10 quiz-info">
                    <h2>${quiz.title}</h2>
                    <p>${quiz.description}</p>
                    <p>Total Questions: ${quiz.totalQuestions}</p>
                    <p>Duration: ${quiz.duration} min</p>
                </div>
                <div class="col-md-2 text-end">
                    <a href="quizDetails.html?quizId=${quiz.id}" class="quiz-btn btn section-text" type="button" style="border-radius: 25px; padding-left: 1vw; padding-right: 1vw; background-color: #245D51; color: white;">Start</a>
                </div>
            </div>
        `;
        quizList.appendChild(quizDiv);
    });
}
function getUserID() {
    if (sessionStorage.userid != null) {
        return sessionStorage.userid;
    } else if (localStorage.userid != null) {
        return localStorage.userid;
    } 
    return null;
}

function redirectToQuizResults() {
    const userId = getUserID();
    if (userId) {
        window.location.href = `view-grades.html?userId=${userId}`;
    } else {
        alert("User not logged in. Please log in to view your quiz results.");
    }
}


fetchQuizzes();

