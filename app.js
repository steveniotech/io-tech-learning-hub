'use strict';
(function (root) {
  const icons = {
    'express-concepts-review':['m9 7-5 5 5 5m6-10 5 5-5 5','m13 4-2 16'],
    'python-steps-lab':['M5 4h10v5H9v6H4V9h5','M19 20H9v-5h6V9h5v6h-5'],
    'reading-steps':['M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Z','M12 6v14'],
    'builder-island':['m12 3 9 5-9 5-9-5 9-5Z','M3 8v9l9 5 9-5V8m-9 5v9'],
    'mbot-robotics':['M5 8h14v12H5V8Zm7-5v5M2 12v4m20-4v4','M8 12h1m6 0h1m-7 4h6'],
    'snap-circuits':['M3 8h5v8H3V8Zm13 0h5v8h-5V8Z','M8 12h8M5 4v4m14-4v4M5 16v4m14-4v4'],
    'terminal-steps-lab':['M3 4h18v16H3V4Z','m7 9 3 3-3 3m6 1h4']
  };
  function node(document, tag, className, text) {
    const item = document.createElement(tag);
    if (className) item.className = className;
    if (text !== undefined) item.textContent = text;
    return item;
  }
  function renderCourses(document, courses) {
    // Validate before rendering; an edited catalog must not introduce executable links.
    const ids = new Set();
    for (const course of courses) {
      const url = new URL(course.url);
      if (!/^[a-z0-9-]+$/.test(course.id) || ids.has(course.id) || url.protocol !== 'https:' || url.username || url.password ||
          !Number.isFinite(course.order) || ![course.name,course.category,course.description,course.button].every(value => typeof value === 'string' && value.trim())) {
        throw new Error('Invalid course catalog');
      }
      ids.add(course.id);
    }
    const grid = document.getElementById('course-grid');
    const fragment = document.createDocumentFragment();
    [...courses].sort((a,b) => a.order-b.order).forEach((course,index) => {
      const item = node(document,'li','course-item');
      const card = node(document,'article','course-card');
      card.dataset.course = course.id;
      const top = node(document,'div','card-top');
      const icon = document.createElementNS('http://www.w3.org/2000/svg','svg');
      icon.setAttribute('viewBox','0 0 24 24');
      icon.setAttribute('aria-hidden','true');
      icon.setAttribute('focusable','false');
      for (const d of icons[course.id] || icons['express-concepts-review']) {
        const path = document.createElementNS('http://www.w3.org/2000/svg','path');
        path.setAttribute('d',d);icon.append(path);
      }
      const badge = node(document,'span','course-icon');badge.append(icon);
      const number = node(document,'span','course-number',String(index+1).padStart(2,'0'));
      number.setAttribute('aria-hidden','true');top.append(badge,number);
      const category = node(document,'p','category',course.category);
      const title = node(document,'h3','course-name',course.name);title.lang = 'en';
      const description = node(document,'p','course-description',course.description);
      const link = node(document,'a','course-link');
      link.setAttribute('href',course.url); // Preserve the supplied string, not URL serialization.
      link.setAttribute('aria-label',course.button+': '+course.name);
      link.append(node(document,'span','',course.button),node(document,'span','link-arrow','↗'));
      link.lastChild.setAttribute('aria-hidden','true');
      card.append(top,category,title,description,link);item.append(card);fragment.append(item);
    });
    grid.replaceChildren(fragment);
    document.getElementById('course-count').textContent = courses.length+' courses';
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = {renderCourses};
  if (typeof document !== 'undefined') {
    try { renderCourses(document,root.LearningCourses); }
    catch { document.getElementById('course-error').hidden = false; }
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
