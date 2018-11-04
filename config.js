const CONFIG = {

  // the category, name, key, url, search path and color for your commands
  // if none of the specified keys are matched, the '*' key is used
  commands: [
    [null, 'Google', '*', 'https://encrypted.google.com', '/search?q={}', '#111'],
    [false, 'Learn.UQ', 'u', 'https://learn.uq.edu.au', '/webapps/blackboard/execute/viewCatalog?type=Course&command=NewSearch&searchText={}', '#6a2885'],
    ['University', 'Math1072', 'um', 'https://learn.uq.edu.au/MATH1072', null, 'rgb(63, 81, 181)'],
    [false, '', 'MATLAB', 'https://courses.smp.uq.edu.au/MATH1052/modules/index.php', null],
    ['University', 'Stat1301', 'us', 'https://learn.uq.edu.au/STAT1301', null, 'rgb(11, 128, 67)'],
    [false, '', 'Workshops', 'https://courses.smp.uq.edu.au/STAT1301/2018b/index.php', null],
    [false, '', 'Tables', 'https://people.smp.uq.edu.au/MichaelBulmer/pida/pida52/Tables.pdf', null],
    ['University', 'Csse2002', 'uc', 'https://learn.uq.edu.au/CSSE2002', null, 'rgb(192, 73, 36)'],
    [false, '', 'CSSE2002 Piazza', 'https://piazza.com/class/jjxlccsshcp2mw', null],
    ['University', 'Infs1200', 'ui', 'https://learn.uq.edu.au/INFS1200', null, 'rgb(142, 36, 170)'],
    [false, '', 'INFS1200 Piazza', 'https://piazza.com/class/jidw0pl377519t', null],
    [false, '', 'RiPPLE', 'https://learn.uq.edu.au/webapps/osc-BasicLTI-BBLEARN/tool.jsp?course_id=_118614_1&content_id=_4068515_1', null],

    ['Social', 'Twitter', 't', 'https://twitter.com', '/search?q={}', '#4ab3f4'],
    ['Social', 'Facebook', 'f', 'https://www.facebook.com', '/search/top/?q={}', '#4267b2'],
    [false, '', 'Messenger', 'https://www.facebook.com/messages/', null],

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
    'f': [],
    'd': ['d/u/1'],
    'g': ['g/issues', 'g/pulls', 'gist.github.com', 'g/cadejscroggins'],
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

  // change clock to twelve hour format
  twelveHour: false,
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