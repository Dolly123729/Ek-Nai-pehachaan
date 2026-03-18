let completedCount = parseInt(localStorage.getItem('ielts_progress')) || 0;
const totalItems = 50;

window.onload = function () {
    const completedItems = JSON.parse(localStorage.getItem('completed_list')) || [];
    const items = document.querySelectorAll('.material-item');

    items.forEach((item, index) => {
        if (completedItems.includes(index)) {
            item.classList.add('completed');
        }
    });

    completedCount = completedItems.length;
    updateProgress();
};

function showPractice(btn, title, content) {
    const item = btn.parentElement;
    const allItems = Array.from(document.querySelectorAll('.material-item'));
    const itemIndex = allItems.indexOf(item);

    if (!item.classList.contains('completed')) {
        item.classList.add('completed');
        completedCount++;

        let completedItems = JSON.parse(localStorage.getItem('completed_list')) || [];
        completedItems.push(itemIndex);

        localStorage.setItem('completed_list', JSON.stringify(completedItems));
        localStorage.setItem('ielts_progress', completedCount);

        updateProgress();
    }

    document.getElementById('modalTitle').innerHTML = title;
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('practiceModal').style.display = 'block';
}

function updateProgress() {
    document.getElementById('progressText').innerText = completedCount + "/" + totalItems;
    document.getElementById('progressBar').style.width =
        (completedCount / totalItems) * 100 + "%";
}
