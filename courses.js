'use strict';
// The only course catalog. Keep complete URLs, including paths and fragments.
(function (root) {
  const courses = [
    {id:'express-concepts-review',name:'Express Concepts Review',category:'Coding',description:'Review coding ideas with short practice activities.',button:'Start Learning',url:'https://steveniotech.github.io/express-concepts-review/',order:1},
    {id:'python-steps-lab',name:'Python Steps Lab',category:'Python',description:'Write Python code and build your skills, one step at a time.',button:'Start Coding',url:'https://steveniotech.github.io/python-steps-lab/index.html',order:2},
    {id:'reading-steps',name:'Reading Steps',category:'Reading',description:'Practice reading and understanding what you read.',button:'Start Reading',url:'https://steveniotech.github.io/reading-steps/',order:3},
    {id:'builder-island',name:'Builder Island',category:'3D Design',description:'Explore shapes and practice your 3D design skills.',button:'Start Building',url:'https://steveniotech.github.io/builder-island/',order:4},
    {id:'mbot-robotics',name:'mBot Robotics',category:'Robotics',description:'Practice coding for your mBot robot.',button:'Explore Robots',url:'https://iotechcentermbotpractice.netlify.app/#level-3',order:5},
    {id:'snap-circuits',name:'Snap Circuits',category:'Circuits',description:'Explore circuits and practice your electronics skills.',button:'Explore Circuits',url:'https://iocentersnapcircuitspractice.netlify.app/#learn',order:6},
    {id:'terminal-steps-lab',name:'Terminal Steps Lab',category:'Computer Skills',description:'Learn to use the terminal, one command at a time.',button:'Try the Terminal',url:'https://steveniotech.github.io/terminal-steps-lab/',order:7}
  ];
  root.LearningCourses = Object.freeze(courses.map(course => Object.freeze(course)));
  if (typeof module !== 'undefined' && module.exports) module.exports = root.LearningCourses;
})(typeof globalThis !== 'undefined' ? globalThis : this);
