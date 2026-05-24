function toggleFaq(element) {
    const allAnswers = document.querySelectorAll('.faq-answer');
    const allArrows = document.querySelectorAll('.faq-arrow');
    const answer = element.nextElementSibling;
    const arrow = element.querySelector('.faq-arrow');
    const isOpen = answer.classList.contains('open');

    allAnswers.forEach(a => a.classList.remove('open'));
    allArrows.forEach(a => a.classList.remove('rotated'));

    if (!isOpen) {
        answer.classList.add('open');
        arrow.classList.add('rotated');
    }
}