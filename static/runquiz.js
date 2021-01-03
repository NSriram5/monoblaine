function handleCheckAnswer(e) {
    e.preventDefault();
    let score = 0;
    let count = 0;
    let questions = $(".question-frame").toArray();
    for (question of questions) {
        question = $(question);
        let answer = question.attr('data-correct-answer');
        let selected = question.find(`input:checked`).val();
        if (answer == selected) {
            let correction_note = $("<span>").addClass("answer-correction bg-success").text(`Correct answer`);
            question.find('.answers').append(correction_note);
            score++;
        } else {
            let correction_note = $("<span>").addClass("answer-correction bg-danger").text(`The answer is ${answer}`);
            question.find('.answers').append(correction_note);
        }
        count++;

    }
    let grade_report = $("<div>").addClass("alert alert-primary").text(`Your score is ${score} out of ${count}`)
    $('#quiz-questions').append(grade_report);
    return;
}

$(function() {
    $("#checkanswer-btn").click(handleCheckAnswer)
})