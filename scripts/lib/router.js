// inject stylesheet
(function() {
	var style = document.createElement('style');
	// WebKit hack :(
	style.appendChild(document.createTextNode(''));
	style.innerHTML =
		'[page] { display:none; } [page]:not(.selected) { display:none; }';
	// Add the <style> element to the page
	document.head.appendChild(style);
})();

var Router = (function() {
	let navBtns;
	let pages;

	let Router = {
		current: null,
		routes: {},
		root: '/',
		default: '/',
		config: function(options) {
			this.default = options.default || options.root || this.root;
			Object.assign(options, this);
			return this;
		},
		add: function(options) {
			// build regex pattern for validation
			options.re =
				options.path
					.replace(/{([a-zA-Z]|\d)*}/g, '(\\d|[a-zA-Z])*')
					.replace(/\\/, '\\') + '$';
			options.re = new RegExp(options.re);
			// build route param patterns
			let routeParts = options.path.split('/');
			let params = [];
			routeParts.forEach(function(routePart, i) {
				if (/{([a-zA-Z]|\d)*}/.test(routePart)) {
					let name = routePart.slice(1, -1);
					let routeParam = {
						name: name,
						getter: function(path) {
							return path.split('/')[i];
						}
					};
					params.push(routeParam);
				}
			});
			options.params = params;

			this.routes[options.path] = options;
			return this;
		},
		navigate: function(options) {
			if (options.default) {
				window.location.href =
					window.location.href.replace(/#(.*)$/, '') + '#' + this.default;
				return this;
			} else if (options.name) {
				for (let route in this.routes) {
					if (this.routes[route].name === options.name) {
						this.current = {
							name: options.name,
							route: this.routes[route],
							path: this.routes[route].path
						};
						break;
					}
				}

				if (options.params) {
					let path = this.current.route.path;
					for (let param in options.params) {
						path = path.replace('{' + param + '}', options.params[param]);
					}
					this.current.path = path;
					this.current.params = options.params;
				}
				if (options.query) {
					let queryParams = new URLSearchParams();
					for (let param in options.query) {
						queryParams.append(param, options.query[param]);
					}
					this.current.path += '?' + queryParams.toString();
					this.current.query = options.query;
				}
			} else if (options.path) {
				for (let route in this.routes) {
					if (this.routes[route].re.test(options.path)) {
						this.current = {
							route: this.routes[route],
							path: options.path,
							name: this.routes[route].name
						};
						break;
					}
				}
				if (Object.keys(this.current.route.params).length) {
					let self = this;
					this.current.params = {};
					this.current.route.params.forEach(function(param) {
						self.current.params[param.name] = param.getter(self.current.path);
					});
				}
				if (options.queryURL) {
					this.current.query = options.queryURL.values;
					this.current.path += '?' + options.queryURL.string;
				}
			} else {
				throw new Error(
					'navigate options object requires name or path to be defined'
				);
			}

			// identify WHICH route is being used & then iterate over that route's route params to get values
			window.location.href =
				window.location.href.replace(/#(.*)$/, '') + '#' + this.current.path;

			changePage(this.current.name);
			this.current.route.handler();
			return this;
		},
		isValidPath: function(path) {
			for (let route in this.routes) {
				if (this.routes[route].re.test(path)) {
					return true;
				}
			}
			return false;
		}
	};

	window.addEventListener('hashchange', handleRouteChange);
	window.addEventListener('load', handleRouteChange);
	window.addEventListener('DOMContentLoaded', initRouteListeners);

	return Router;

	function handleRouteChange(event) {
		let queryIdx = window.location.hash.indexOf('?');
		let hash = window.location.hash.slice(
			1,
			queryIdx !== -1 ? queryIdx : undefined
		);
		let query;

		let urlQuery = window.location.hash.match(/\?.*$/);
		if (urlQuery && urlQuery.length) {
			let search = new URLSearchParams(urlQuery[0].slice(1));
			let keys = search.keys();
			query = { values: {}, string: search.toString() };
			for (let key of keys) {
				query.values[key] = search.get(key);
			}
		}

		if (Router.isValidPath(hash.trim())) {
			Router.navigate({ path: hash, queryURL: query });
		} else {
			Router.navigate({ default: true });
		}
	}

	function initRouteListeners() {
		navBtns = document.querySelectorAll('[nav-to]');
		pages = document.querySelectorAll('[page]');
		// setup listeners & navigation system
		forEach(navBtns, el => {
			el.addEventListener('click', event => {
				Router.navigate({ name: event.target.getAttribute('nav-to') });
			});
		});
	}

	function forEach(nodeList, fn) {
		for (let i = 0; i < nodeList.length; i++) {
			fn(nodeList[i]);
		}
	}

	function changePage(page) {
		forEach(pages, el => {
			if (el.getAttribute('id') === page) {
				el.classList.add('selected');
			} else {
				el.classList.remove('selected');
			}
		});
		forEach(navBtns, el => {
			if (el.getAttribute('nav-to') === page) {
				el.classList.add('active');
			} else {
				el.classList.remove('active');
			}
		});
	}

	// connect to html to change routes
	// preload & cache template paths as part of add()
})();
