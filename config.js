const CONFIG = {

  // the category, name, key, url, search path and color for your commands
  // if none of the specified keys are matched, the '*' key is used
  commands: [
    [null, 'Google', '*', 'https://encrypted.google.com', '/search?q={}', 'var(--nord0)'],
    [false, 'Learn.UQ', 'u', 'https://learn.uq.edu.au', '/webapps/blackboard/execute/viewCatalog?type=Course&command=NewSearch&searchText={}', '#6a2885'],
    ['Courses', 'Math1072', 'um', 'https://learn.uq.edu.au/MATH1072', null, 'rgb(63, 81, 181)'],
    [false, '', 'MATLAB', 'https://courses.smp.uq.edu.au/MATH1052/modules/index.php', null],
    ['Courses', 'Stat1301', 'us', 'https://learn.uq.edu.au/STAT1301', null, 'rgb(11, 128, 67)'],
    [false, '', 'Workshops', 'https://courses.smp.uq.edu.au/STAT1301/2018b/index.php', null],
    [false, '', 'Tables', 'https://people.smp.uq.edu.au/MichaelBulmer/pida/pida52/Tables.pdf', null],
    ['Courses', 'Csse2002', 'uc', 'https://learn.uq.edu.au/CSSE2002', null, 'rgb(192, 73, 36)'],
    [false, '', 'CSSE2002 Piazza', 'https://piazza.com/class/jjxlccsshcp2mw', null],
    ['Courses', 'Infs1200', 'ui', 'https://learn.uq.edu.au/INFS1200', null, 'rgb(142, 36, 170)'],
    [false, '', 'INFS1200 Piazza', 'https://piazza.com/class/jidw0pl377519t', null],
    [false, '', 'RiPPLE', 'https://learn.uq.edu.au/webapps/osc-BasicLTI-BBLEARN/tool.jsp?course_id=_118614_1&content_id=_4068515_1', null],
    
    ['University', 'GitHub', 'g', 'https://github.com', null, 'var(--nord1)'],
    ['University', 'UQCS Slack', 's', 'https://uqcs.slack.com', null, '#4d394b'],
    ['University', 'Exams', 'ue', 'https://www.library.uq.edu.au/exams/', '/exams/papers.php?stub={}', '#6a2885'],

    ['Social', 'Twitter', 't', 'https://twitter.com', '/search?q={}', '#4ab3f4'],
    ['Social', 'Facebook', 'f', 'https://www.facebook.com', '/search/top/?q={}', '#4267b2'],
    ['Social', 'Reddit', 'r', 'https://www.reddit.com', '/search?q={}', '#5f99cf'],

    ['Watch', 'Netflix', 'n', 'https://www.netflix.com/browse', '/search?q={}', '#e50914'],
    ['Watch', 'Twitch', 't', 'https://www.twitch.tv/directory/following', null, '#6441a5'],
    ['Watch', 'YouTube', 'y', 'https://youtube.com/feed/subscriptions', '/results?search_query={}', '#cd201f'],

  ],

  // give suggestions as you type
  suggestions: true,

  // max amount of suggestions that will ever be displayed
  suggestionsLimit: 4,

  // the order and limit for each suggestion influencer
  // "Default" suggestions come from CONFIG.defaultSuggestions
  // "DuckDuckGo" suggestions come from the duck duck go search api
  // "History" suggestions come from your previously entered queries
  influencers: [
    { name: 'Default', limit: 4 },
    { name: 'History', limit: 1 },
    { name: 'DuckDuckGo', limit: 4 },
  ],

  // default search suggestions for the specified queries
  defaultSuggestions: {
    'um': [],
    'us': [],
    'uc': [],
    'ui': [],
    'f': ['f/messages'],
    'd': ['d/u/1'],
    'g': ['g/KentonLam', 'g/issues', 'g/pulls'],
    'i': ['i/u/1'],
    'k': ['k/u/1'],
    'l': ['l/#electronic+chill', 'l/#synthwave+chillwave', 'l/#focus+instrumental', 'l/#piano+sleep'],
    'm': ['m/music/listen?u=1#/all'],
    'p': ['p/u/1'],
    'r': ['r/r/unixporn', 'r/r/startpages', 'r/r/webdev', 'r/r/technology'],
    's': ['s/you/likes', 's/discover/the-upload'],
  },

  // instantly redirect when a key is matched
  // put a space before any other queries to prevent unwanted redirects
  instantRedirect: false,

  // open queries in a new tab
  newTab: true,

  // dynamic background colors when command domains are matched
  colors: true,

  // specify a theme file
  // remove or set to false to use the hardcoded theme
  theme: false,

  // the delimiter between the key and your search query
  // e.g. to search GitHub for potatoes you'd type "g:potatoes"
  searchDelimiter: ':',

  // the delimiter between the key and a path
  // e.g. type "r/r/unixporn" to go to "reddit.com/r/unixporn"
  pathDelimiter: '/',

  // the delimiter between the hours and minutes in the clock
  clockDelimiter: ' ',

  // the delimiter between day, month and year
  dateDelimiter: ' ',

  // the delimiter between the week number and the semester name
  weekDelimiter: ' &mdash; ',

  // change clock to twelve hour format
  twelveHour: false,

  // weeks of the university calendar
  weeks: [
    { "start": "2018-02-19", "end": "2018-04-01", "from": 1, "name": "Semester 1" },
    { "start": "2018-04-02", "end": "2018-04-15", "from": 1, "name": "Mid-sem Break" },
    { "start": "2018-04-16", "end": "2018-06-03", "from": 8, "name": "Semester 1" },
    { "start": "2018-06-04", "end": "2018-06-08", "from": 14, "name": "Swotvac" },
    { "start": "2018-06-09", "end": "2018-06-24", "from": 15, "name": "Exams" },
    { "start": "2018-07-23", "end": "2018-09-23", "from": 1, "name": "Semester 2" },
    { "start": "2018-09-24", "end": "2018-09-30", "from": 1, "name": "Mid-sem Break" },
    { "start": "2018-10-02", "end": "2018-10-28", "from": 10, "name": "Semester 2" },
    { "start": "2018-10-29", "end": "2018-11-02", "from": 14, "name": "Swotvac" },
    { "start": "2018-11-03", "end": "2018-11-18", "from": 15, "name": "Exams" },
    { "start": "2018-11-26", "end": "2018-12-23", "from": 1, "name": "Summer Semester" },
    { "start": "2018-12-24", "end": "2018-12-30", "from": 1, "name": "Mid-sem Break" },
    { "start": "2019-01-02", "end": "2019-01-27", "from": 5, "name": "Summer Semester" },
    { "start": "2019-01-28", "end": "2019-02-01", "from": 9, "name": "Swotvac" },
    { "start": "2019-02-02", "end": "2019-02-10", "from": 10, "name": "Exams" },
    { "start": "2019-02-25", "end": "2019-04-21", "from": 1, "name": "Semester 1" },
    { "start": "2019-04-22", "end": "2019-04-28", "from": 1, "name": "Mid-sem Break" },
    { "start": "2019-04-29", "end": "2019-06-02", "from": 9, "name": "Semester 1" },
    { "start": "2019-06-03", "end": "2019-06-07", "from": 14, "name": "Swotvac" },
    { "start": "2019-06-08", "end": "2019-06-23", "from": 15, "name": "Exams" },
    { "start": "2019-07-22", "end": "2019-09-29", "from": 1, "name": "Semester 2" },
    { "start": "2019-09-30", "end": "2019-10-06", "from": 1, "name": "Mid-sem Break" },
    { "start": "2019-10-08", "end": "2019-10-27", "from": 11, "name": "Semester 2" },
    { "start": "2019-10-28", "end": "2019-11-01", "from": 14, "name": "Swotvac" },
    { "start": "2019-11-02", "end": "2019-11-17", "from": 15, "name": "Exams" }
  ]
};

let parentCommand = null;
for (const command of CONFIG.commands) {
  if (command[0] === false) {
    if (command[5] === undefined)
      command[5] = parentCommand[5];
    const key = parentCommand[2];
    if (CONFIG.defaultSuggestions[key] !== undefined)
      CONFIG.defaultSuggestions[key].push(command[2]);
  } else {
    parentCommand = command;
  }
}