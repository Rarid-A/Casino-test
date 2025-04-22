function openTab(evt, tabName) {
  const tabcontent = document.querySelectorAll('.tabcontent');
  const tablinks = document.querySelectorAll('.tablink');

  tabcontent.forEach((content) => content.style.display = 'none');
  tablinks.forEach((tab) => tab.classList.remove('active'));

  document.getElementById(tabName).style.display = 'block';
  evt.currentTarget.classList.add('active');
}
