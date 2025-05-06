// Scroll progress bar
window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    document.getElementById('scrollProgress').style.width = scrolled + '%';
  });
  
  // Font size toggle
  document.getElementById('fontToggle').addEventListener('click', () => {
    const content = document.querySelector('.blog-content');
    const currentSize = window.getComputedStyle(content).fontSize;
    const newSize = parseFloat(currentSize) + 2;
    content.style.fontSize = newSize + 'px';
  });
  
  // Dark mode toggle
  document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
  
  // Read time estimation
  window.addEventListener('DOMContentLoaded', () => {
    const words = document.querySelector('.blog-content').innerText.split(' ').length;
    const readTime = Math.ceil(words / 200); // avg reading speed ~200 wpm
    document.getElementById('readTime').textContent = `${readTime} min read`;
  });
  