const $ = {
  bodyClassAdd: c => $.el('body').classList.add(c),
  bodyClassRemove: c => $.el('body').classList.remove(c),
  el: s => document.querySelector(s),
  els: s => [].slice.call(document.querySelectorAll(s) || []),
  escapeRegex: s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),
  ieq: (a, b) => a.toLowerCase() === b.toLowerCase(),
  iin: (a, b) => a.toLowerCase().indexOf(b.toLowerCase()) !== -1,
  isDown: e => ['c-n', 'down', 'tab'].includes($.key(e)),
  isRemove: e => ['backspace', 'delete'].includes($.key(e)),
  isUp: e => ['c-p', 'up', 's-tab'].includes($.key(e)),

  jsonp: url => {
    let script = document.createElement('script');
    script.src = url;
    $.el('head').appendChild(script);
  },

  key: e => {
    const ctrl = e.ctrlKey;
    const shift = e.shiftKey;

    switch (e.which) {
      case 8: return 'backspace';
      case 9: return shift ? 's-tab' : 'tab';
      case 13: return 'enter';
      case 16: return 'shift';
      case 17: return 'ctrl';
      case 18: return 'alt';
      case 27: return 'escape';
      case 38: return 'up';
      case 40: return 'down';
      case 46: return 'delete';
      case 78: return ctrl ? 'c-n' : 'n';
      case 80: return ctrl ? 'c-p' : 'n';
      case 91: return 'super';
    }
  },

  pad: v => ('0' + v.toString()).slice(-2),
  tickInterval: (f, tick) => {
    f();
    setTimeout(() => $.tickInterval(f, tick), tick-Date.now()%tick);
  }
};

class Clock {
  constructor(options) {
    this._el = $.el('#clock');
    this._delimiter = options.delimiter;
    this._form = options.form;
    this._twelveHour = options.twelveHour;
    this._setTime = this._setTime.bind(this);
    this._el.addEventListener('click', this._form.show);
    this._start();
  }

  _setTime() {
    const date = new Date();
    let hours = $.pad(date.getHours());
    let amPm = '';

    if (this._twelveHour) {
      hours = date.getHours() > 12
        ? date.getHours() - 12
        : date.getHours() === 0
          ? 12
          : date.getHours();

      amPm = `&nbsp;<span id="am-pm">` +
        `${date.getHours() > 12 ? 'PM' : 'AM'}</span>`;
    }

    const minutes = $.pad(date.getMinutes());
    this._el.innerHTML = `${hours}${this._delimiter}${minutes}${amPm}`;
    this._el.setAttribute('datetime', date.toTimeString());
  }

  _start() {
    $.tickInterval(this._setTime, 60000);
  }
}

class DateDisplay {
  constructor(options) {
    this._el = $.el('#date');
    this._delimiter = options.delimiter;
    this._setDate = this._setDate.bind(this);
    this._start();
  }

  _start() {
    $.tickInterval(this._setDate, 1000*60*60*24);
  }

  _setDate() {
    const d = this._delimiter;
    
    const date = new Date();
    const dd = date.getDate();
    const mm = date.getMonth() + 1; // zero indexed
    const yyyy = date.getFullYear();

    this._el.innerHTML = `${dd}${d}${mm}${d}${yyyy}`;
  }
}

class Week {
  constructor(options) {
    this._el = $.el('#week');
    this._delimiter = options.delimiter;
    this._weeks = this._parseWeeks(options.weeks); 
    this._setWeek = this._setWeek.bind(this);
    this._start();
  }

  _parseDate(date) {
    const dateParts = date.split('-');
    return new Date(
      parseInt(dateParts[0]), parseInt(dateParts[1])-1, parseInt(dateParts[2]));
  }

  _parseWeeks(weeks) {
    return weeks.map(w => {
      return {
        start: this._parseDate(w['start']),
        end: this._parseDate(w['end']),
        from: w['from'],
        name: w['name']
      }
    });
  }

  _start() {
    $.tickInterval(this._setWeek, 1000*60*60*24);
  }

  _setWeek() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const w = this._weeks
      .filter(w => w.start<=today && today <=w.end)
      .sort(w => w.start)
      [0];

    if (typeof w === 'undefined') {
      this._el.innerHTML = '';
      this._el.style.display = 'none';
      return;
    }
    
    this._el.style.display = null;
    
    // Compute the first Monday after w.start.
    const firstMon = w.start;
    firstMon.setDate(firstMon.getDate() + (1+7-firstMon.getDay()) % 7);
    
    const WEEK = 1000*60*60*24*7;
    const weeksElapsed = Math.max(0, Math.floor((today-firstMon) / WEEK));

    const d = this._delimiter;
    this._el.innerHTML = `Week ${w.from+weeksElapsed}${d}${w.name}`;
  }
}

class Help {
  constructor(options) {
    this._el = $.el('#help');
    this._commands = options.commands;
    this._newTab = options.newTab;
    this._toggled = false;
    this._handleKeydown = this._handleKeydown.bind(this);
    this._buildAndAppendLists();
    this._registerEvents();
  }

  toggle(show) {
    this._toggled = (typeof show !== 'undefined') ? show : !this._toggled;
    this._toggled ? $.bodyClassAdd('help') : $.bodyClassRemove('help');
  }

  _buildAndAppendLists() {
    const lists = document.createElement('ul');
    lists.classList.add('categories');

    this._getCategories().forEach(category => {
      lists.insertAdjacentHTML(
        'beforeend',
        `<li class="category">
          <h2 class="category-name">${category}</h2>
          <ul>${this._buildListCommands(category)}</ul>
        </li>`,
      );
    });

    this._el.appendChild(lists);
  }

  _buildListCommands(category) {
    return this._commands
      .map(([cmdCategory, name, key, url]) => {
        if (cmdCategory === category) {
          return (
            `<li class="command">
              <a href="${url}" target="${this._newTab ? '_blank' : '_self'}">
                <span class="command-key">${key}</span>
                <span class="command-name">${name}</span>
              </a>
            </li>`
          );
        }
      })
      .join('');
  }

  _getCategories() {
    const categories = this._commands
      .map(([category]) => category)
      .filter(category => category);

    return [...new Set(categories)];
  }

  _handleKeydown(e) {
    if ($.key(e) === 'escape') this.toggle(false);
  }

  _registerEvents() {
    document.addEventListener('keydown', this._handleKeydown);
  }
}

class Influencer {
  constructor(options) {
    this._limit = options.limit;
    this._queryParser = options.queryParser;
  }

  addItem() {}
  getSuggestions() {}

  _addSearchPrefix(items, query) {
    const searchPrefix = this._getSearchPrefix(query);
    return items.map(s => searchPrefix ? searchPrefix + s : s);
  }

  _getSearchPrefix(query) {
    const { isSearch, key, split } = this._parseQuery(query);
    return isSearch ? `${key}${split} ` : false;
  }

  _parseQuery(query) {
    return this._queryParser.parse(query);
  }
}

class DefaultInfluencer extends Influencer {
  constructor({ defaultSuggestions }) {
    super(...arguments);
    this._defaultSuggestions = defaultSuggestions;
  }

  getSuggestions(query) {
    return new Promise(resolve => {
      const suggestions = this._defaultSuggestions[query];
      resolve(suggestions ? suggestions.slice(0, this._limit) : []);
    });
  }
}

class DuckDuckGoInfluencer extends Influencer {
  constructor({ queryParser }) {
    super(...arguments);
  }

  getSuggestions(rawQuery) {
    const { query } = this._parseQuery(rawQuery);
    if (!query) return Promise.resolve([]);

    return new Promise(resolve => {
      const endpoint = 'https://duckduckgo.com/ac/';
      const callback = 'autocompleteCallback';

      window[callback] = res => {
        const suggestions = res.map(i => i.phrase)
          .filter(s => !$.ieq(s, query))
          .slice(0, this._limit);

        resolve(this._addSearchPrefix(suggestions, rawQuery));
      };

      $.jsonp(`${endpoint}?callback=${callback}&q=${query}`);
    });
  }
}

class HistoryInfluencer extends Influencer {
  constructor() {
    super(...arguments);
    this._storeName = 'history';
  }

  addItem(query) {
    if (query.length < 2) return;
    let exists;

    const history = this._getHistory().map(([item, count]) => {
      const match = $.ieq(item, query);
      if (match) exists = true;
      return [item, match ? count + 1 : count];
    });

    if (!exists) history.push([query, 1]);

    const sorted = history
      .sort((current, next) => current[1] - next[1])
      .reverse();

    this._setHistory(sorted);
  }

  getSuggestions(query) {
    return new Promise(resolve => {
      const suggestions = this._getHistory()
        .map(([item]) => item)
        .filter(item => query && !$.ieq(item, query) && $.iin(item, query))
        .slice(0, this._limit);

      resolve(suggestions);
    });
  }

  _fetch() {
    return JSON.parse(localStorage.getItem(this._storeName)) || [];
  }

  _getHistory() {
    this._history = this._history || this._fetch();
    return this._history;
  }

  _save(history) {
    localStorage.setItem(this._storeName, JSON.stringify(history));
  }

  _setHistory(history) {
    this._history = history;
    this._save(history);
  }
}

class Suggester {
  constructor(options) {
    this._el = $.el('#search-suggestions');
    this._influencers = options.influencers;
    this._limit = options.limit;
    this._suggestionEls = [];
    this._handleKeydown = this._handleKeydown.bind(this);
    this._registerEvents();
  }

  setOnClick(callback) {
    this._onClick = (ev) => {
      const suggestion = ev.target.dataset['suggestion'];
      callback(suggestion);
    };
  }

  setOnHighlight(callback) {
    this._onHighlight = callback;
  }

  setOnUnhighlight(callback) {
    this._onUnhighlight = callback;
  }

  success(query) {
    this._clearSuggestions();
    this._influencers.forEach(i => i.addItem(query));
  }

  suggest(input) {
    input = input.trim();
    if (input === '') this._clearSuggestions();

    Promise.all(this._getInfluencerPromises(input)).then(res => {
      const suggestions = Suggester._flattenAndUnique(res);
      this._clearSuggestions();

      if (suggestions.length) {
        this._appendSuggestions(suggestions, input);
        this._registerSuggestionEvents();
        $.bodyClassAdd('suggestions');
      }
    });
  }

  // [[1, 2], [1, 2, 3, 4]] -> [1, 2, 3, 4]
  static _flattenAndUnique(array) {
    return [...new Set([].concat.apply([], array))];
  }

  _appendSuggestions(suggestions, input) {
    for (const [i, suggestion] of suggestions.entries()) {
      const match = new RegExp('('+$.escapeRegex(input)+')', 'ig');
      const suggestionHtml = suggestion.replace(match, '<b>$1</b>');

      this._el.insertAdjacentHTML(
        'beforeend',
        `<li>
          <button
            type="button"
            class="js-search-suggestion search-suggestion"
            data-suggestion="${suggestion}"
            tabindex="-1"
          >
            ${suggestionHtml}
          </button>
        </li>`,
      );

      if (i + 1 >= this._limit) break;
    }

    this._suggestionEls = $.els('.js-search-suggestion');
  }

  _clearClickEvents() {
    this._suggestionEls.forEach(el => {
      const callback = this._onClick;
      el.removeEventListener('click', callback);
    });
  }

  _clearSuggestions() {
    $.bodyClassRemove('suggestions');
    this._clearClickEvents();
    this._suggestionEls = [];
    this._el.innerHTML = '';
  }

  _focusNext(e) {
    const exists = this._suggestionEls.some((el, i) => {
      if (el.classList.contains('highlight')) {
        this._highlight(this._suggestionEls[i + 1], e);
        return true;
      }
    });

    if (!exists) this._highlight(this._suggestionEls[0], e);
  }

  _focusPrevious(e) {
    const exists = this._suggestionEls.some((el, i) => {
      if (el.classList.contains('highlight') && i) {
        this._highlight(this._suggestionEls[i - 1], e);
        return true;
      }
    });

    if (!exists) this._unHighlight(e);
  }

  _getInfluencerPromises(input) {
    return this._influencers
      .map(influencer => influencer.getSuggestions(input));
  }

  _handleKeydown(e) {
    if ($.isDown(e)) this._focusNext(e);
    if ($.isUp(e)) this._focusPrevious(e);
  }

  _highlight(el, e) {
    this._unHighlight();

    if (el) {
      this._onHighlight(el.getAttribute('data-suggestion'));
      el.classList.add('highlight');
      e.preventDefault();
    }
  }

  _registerEvents() {
    document.addEventListener('keydown', this._handleKeydown);
  }

  _registerSuggestionEvents() {
    const noHighlightUntilMouseMove = () => {
      window.removeEventListener('mousemove', noHighlightUntilMouseMove);

      this._suggestionEls.forEach(el => {
        const value = el.getAttribute('data-suggestion');
        el.addEventListener('mouseover', this._highlight.bind(this, el));
        el.addEventListener('mouseout', this._unHighlight.bind(this));
        el.addEventListener('click', this._onClick);
      });
    };

    window.addEventListener('mousemove', noHighlightUntilMouseMove);
  }

  _unHighlight(e) {
    const el = $.el('.highlight');

    if (el) {
      this._onUnhighlight();
      el.classList.remove('highlight');
      if (e) e.preventDefault();
    }
  }
}

class QueryParser {
  constructor(options) {
    this._commands = options.commands;
    this._searchDelimiter = options.searchDelimiter;
    this._pathDelimiter = options.pathDelimiter;
    this._protocolRegex = /^[a-zA-Z]+:\/\//i;
    this._urlRegex = /^((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)$/i;
  }

  parse(query) {
    const res = { query: query, split: null };

    if (query.match(this._urlRegex)) {
      const hasProtocol = query.match(this._protocolRegex);
      res.redirect = hasProtocol ? query : 'http://' + query;
    } else {
      const splitSearch = query.split(this._searchDelimiter);
      const splitPath = query.split(this._pathDelimiter);

      this._commands.some(([category, name, key, url, searchPath]) => {
        res.isKey = query === key;
        res.isSearch = !res.isKey && splitSearch[0] === key;
        res.isPath = !res.isKey && splitPath[0] === key;

        if (res.isKey || res.isSearch || res.isPath) {
          res.key = key;

          if (res.isSearch && searchPath) {
            res.split = this._searchDelimiter;
            res.query = QueryParser._shiftAndTrim(splitSearch, res.split);
            res.redirect = QueryParser._prepSearch(url, searchPath, res.query);
          } else if (res.isPath) {
            res.split = this._pathDelimiter;
            res.path = QueryParser._shiftAndTrim(splitPath, res.split);
            res.redirect = QueryParser._prepPath(url, res.path);
          } else {
            res.redirect = url;
          }

          return true;
        }

        if (key === '*') {
          res.redirect = QueryParser._prepSearch(url, searchPath, query);
        }
      });
    }

    res.color = QueryParser._getColorFromUrl(this._commands, res.redirect);
    return res;
  }

  static _getColorFromUrl(commands, url) {
    const domain = new URL(url).hostname;

    const exactMatch = commands.filter(c => c[3] === url).map(c => c[5])[0];
    if (exactMatch) 
      return exactMatch;

    return commands
      .filter(c => new URL(c[3]).hostname === domain)
      .map(c => c[5])[0] || null;
  }

  static _prepPath(url, path) {
    return QueryParser._stripUrlPath(url) + '/' + path;
  }

  static _prepSearch(url, searchPath, query) {
    if (!searchPath) return url;
    const baseUrl = QueryParser._stripUrlPath(url);
    const urlQuery = encodeURIComponent(query);
    searchPath = searchPath.replace('{}', urlQuery);
    return baseUrl + searchPath;
  }

  static _shiftAndTrim(arr, delimiter) {
    arr.shift();
    return arr.join(delimiter).trim();
  }

  static _stripUrlPath(url) {
    const parser = document.createElement('a');
    parser.href = url;
    return `${parser.protocol}//${parser.hostname}`;
  }
}

class Form {
  constructor(options) {
    this._formEl = $.el('#search-form');
    this._inputEl = $.el('#search-input');
    this._colors = options.colors;
    this._help = options.help;
    this._suggester = options.suggester;
    this._queryParser = options.queryParser;
    this._instantRedirect = options.instantRedirect;
    this._newTab = options.newTab;
    this._inputElVal = '';
    this._clearPreview = this._clearPreview.bind(this);
    this.show = this.show.bind(this);
    this._handleInput = this._handleInput.bind(this);
    this._handleKeydown = this._handleKeydown.bind(this);
    this._previewValue = this._previewValue.bind(this);
    this._submitForm = this._submitForm.bind(this);
    this._submitWithValue = this._submitWithValue.bind(this);
    this._registerEvents();
    this._loadQueryParam();
  }

  hide() {
    $.bodyClassRemove('form');
    this._suggester._clearSuggestions();
    this._formEl.style.backgroundColor = 'var(--color0)';
    this._inputEl.value = '';
    this._inputElVal = '';
  }

  show() {
    $.bodyClassAdd('form');
    this._inputEl.focus();
  }

  _clearPreview() {
    this._previewValue(this._inputElVal);
    this._inputEl.focus();
  }

  _handleKeydown(e) {
    if ($.isUp(e) || $.isDown(e) || $.isRemove(e)) return;

    switch ($.key(e)) {
      case 'alt':
      case 'ctrl':
      case 'enter':
      case 'shift':
      case 'super':
        return;
      case 'escape':
        this.hide();
        return;
    }

    this.show();
  }

  _handleInput() {
    const newQuery = this._inputEl.value;
    const isHelp = newQuery === '?';
    const { isKey } = this._queryParser.parse(newQuery);
    this._inputElVal = newQuery;
    this._setBackgroundFromQuery(newQuery);
    if (!newQuery || isHelp) this.hide();
    if (isHelp) this._help.toggle();
    if (this._instantRedirect && isKey) this._submitWithValue(newQuery);
    if (this._suggester) this._suggester.suggest(newQuery);
  }

  _loadQueryParam() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const n = params.get('n');
    if (n === '1' || n === '0') {
      this._newTab = n === '1';
    }
    if (q) this._submitWithValue(q);
  }

  _previewValue(value) {
    this._inputEl.value = value;
    this._setBackgroundFromQuery(value);
  }

  _redirect(redirect) {
    if (this._newTab) window.open(redirect, '_blank');
    else window.location.href = redirect;
  }

  _registerEvents() {
    document.addEventListener('keydown', this._handleKeydown);
    this._inputEl.addEventListener('input', this._handleInput);
    this._formEl.addEventListener('submit', this._submitForm, false);

    if (this._suggester) {
      this._suggester.setOnClick(this._submitWithValue);
      this._suggester.setOnHighlight(this._previewValue);
      this._suggester.setOnUnhighlight(this._clearPreview);
    }
  }

  _setBackgroundFromQuery(query) {
    if (!this._colors) return;
    const { color } = this._queryParser.parse(query);
    this._formEl.style.backgroundColor = color;
  }

  _submitForm(e) {
    if (e) e.preventDefault();
    const query = this._inputEl.value;
    if (this._suggester) this._suggester.success(query);
    this.hide();
    this._redirect(this._queryParser.parse(query).redirect);
  }

  _submitWithValue(value) {
    this._inputEl.value = value;
    this._submitForm();
  }
}