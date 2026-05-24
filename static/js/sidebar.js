function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

function toggleSidebarDropdown(element) {
    const menu = element.nextElementSibling;
    menu.classList.toggle('open');
}