// Functions to get current date and ordinal number
function getNewDate() {
    const targetTimezone = 'Asia/Kolkata';
    const currentDate = new Date();
    const options = { timeZone: targetTimezone, day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);
    const [month, day, year] = formattedDate.split(' ');
    const ordinalDay = getOrdinalNumber(parseInt(day));
    return `${ordinalDay} ${month} ${year}`;
};
function getOrdinalNumber(number) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const relevantDigits = (number % 100 > 10 && number % 100 < 20) ? 0 : number % 10;
    return number + (suffixes[relevantDigits] || suffixes[0]);
}

// Get Question Data from the server and display it
window.onload = async () => {
    try {
        const response = await fetch('/getQuestionData');
        if (response.ok) {
            const data = await response.json();
            const questionsContainer = document.getElementById('questions-container');

            for (let i = data.length - 1; i >= 0; i--) {
                const homepageHTML = `
                    <div class="col s12 question">
                        <div class="collection">
                            <div class="collection-item avatar question-display">
                                <img src="data:image/jpeg;base64,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"
                                    alt="" class="circle">
                                <div class="row">
                                    <div class="col s9">
                                        <span class="title black-text bold truncate question-text">${data[i].question}</span>
                                        <span class="question-user-date">By - ${data[i].username} on ${data[i].date}</span>
                                    </div>
                                    <div class="col s3">
                                        <a href="/question.html" class="btn btn-medium cyan secondary-content answer-btn"
                                            id="${data[i]._id}">ANSWER</a>
                                    </div>
                                </div>
                                <span class="upvote vote">
                                    <svg width="36" height="36">
                                        <path d="M2 26h32L18 10 2 26z" fill="currentColor"></path>
                                    </svg>
                                </span>
                                <span class="downvote vote">
                                    <svg width="36" height="36">
                                        <path d="M2 10h32L18 26 2 10z" fill="currentColor"></path>
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                `;
                questionsContainer.insertAdjacentHTML('beforeend', homepageHTML);
            }

            // Event delegation for upvote and downvote buttons
            questionsContainer.addEventListener('click', (event) => {
                const upvoteBtn = event.target.closest('.upvote');
                const downvoteBtn = event.target.closest('.downvote');

                if (upvoteBtn) {
                    const downvoteBtn = upvoteBtn.parentElement.querySelector('.downvote');
                    downvoteBtn.classList.remove('on');
                    upvoteBtn.classList.toggle('on');
                }

                if (downvoteBtn) {
                    const upvoteBtn = downvoteBtn.parentElement.querySelector('.upvote');
                    upvoteBtn.classList.remove('on');
                    downvoteBtn.classList.toggle('on');
                }
            });
        } else {
            console.log('No questions found');
        }
    } catch (err) {
        console.log('Error getting questions', err);
    }
};

// Save submitted question in the db
const questionForm = document.getElementById('question-form');
const questionField = document.getElementById('question-field');
questionForm.addEventListener('submit', (e) => {

    e.preventDefault();
    const question = questionField.value;
    if (question === '') {
        alert('Please enter a question');
        return;
    }
    fetch('/saveQuestionData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: getNewDate(), question: question, username: 'Anonymous' }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            else {
                location.reload();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// Get question data from clicked question and save it in localStorage
document.addEventListener("click", (e) => {
    const target = e.target.closest(".answer-btn");

    if (target) {
        e.preventDefault();
        questionID = target.id;
        questionText = target.parentElement.parentElement.querySelector(".question-text").textContent;
        questionUserDate = target.parentElement.parentElement.querySelector(".question-user-date").textContent;

        // Store data in localStorage
        localStorage.setItem('questionText', questionText);
        localStorage.setItem('questionUserDate', questionUserDate);
        localStorage.setItem('questionID', questionID);

        // Redirect to questions.html
        window.location.href = 'question.html';
    }
});